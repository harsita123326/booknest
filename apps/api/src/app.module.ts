import {
  Module,
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule, JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { PrismaService } from "./prisma.service";
import { JwtGuard, Roles, RolesGuard } from "./auth";
import {
  RegisterDto,
  LoginDto,
  BookDto,
  CategoryDto,
  CartItemDto,
  QuantityDto,
  CheckoutDto,
  StatusDto,
} from "./dto";
import { Role } from "@prisma/client";
const bookInclude = { category: true };
const cartInclude = {
  items: { include: { book: { include: { category: true } } } },
};
const orderInclude = { items: { include: { book: true } } };

@Controller("health")
class HealthController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async check() {
    await this.prisma.$queryRaw`SELECT 1`;
    return {
      status: "ok",
      service: "booknest-api",
      timestamp: new Date().toISOString(),
    };
  }
}
@Controller("auth")
class AuthController {
  constructor(
    private p: PrismaService,
    private jwt: JwtService,
  ) {}
  @Post("register") async register(@Body() d: RegisterDto) {
    if (
      await this.p.user.findUnique({ where: { email: d.email.toLowerCase() } })
    )
      throw new ConflictException("Email already registered");
    const u = await this.p.user.create({
      data: {
        name: d.name,
        email: d.email.toLowerCase(),
        password: await bcrypt.hash(d.password, 12),
      },
    });
    return this.issue(u);
  }
  @Post("login") async login(@Body() d: LoginDto) {
    const u = await this.p.user.findUnique({
      where: { email: d.email.toLowerCase() },
    });
    if (!u || !(await bcrypt.compare(d.password, u.password)))
      throw new BadRequestException("Invalid email or password");
    return this.issue(u);
  }
  private issue(u: any) {
    const { password, ...user } = u;
    return {
      accessToken: this.jwt.sign({ sub: u.id, email: u.email, role: u.role }),
      user,
    };
  }
  @Get("profile") @UseGuards(JwtGuard) profile(@Req() r: any) {
    return this.p.user.findUnique({
      where: { id: r.user.sub },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  }
}
@Controller("books")
class BooksController {
  constructor(private p: PrismaService) {}
  @Get() async all(@Query() q: any) {
    const page = Math.max(+q.page || 1, 1),
      limit = Math.min(+q.limit || 12, 50);
    const where: any = {};
    if (q.search)
      where.OR = [
        { title: { contains: q.search, mode: "insensitive" } },
        { author: { contains: q.search, mode: "insensitive" } },
      ];
    if (q.categoryId) where.categoryId = q.categoryId;
    const orderBy: any =
      q.sort === "price"
        ? { price: q.order === "desc" ? "desc" : "asc" }
        : q.sort === "rating"
          ? { rating: "desc" }
          : { createdAt: "desc" };
    const [data, total] = await this.p.$transaction([
      this.p.book.findMany({
        where,
        include: bookInclude,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.p.book.count({ where }),
    ]);
    return { data, total, page, limit };
  }
  @Get(":id") async one(@Param("id") id: string) {
    const b = await this.p.book.findUnique({
      where: { id },
      include: bookInclude,
    });
    if (!b) throw new NotFoundException("Book not found");
    return b;
  }
  @Post() @UseGuards(JwtGuard, RolesGuard) @Roles(Role.ADMIN) create(
    @Body() d: BookDto,
  ) {
    return this.p.book.create({ data: d, include: bookInclude });
  }
  @Patch(":id")
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async update(@Param("id") id: string, @Body() d: Partial<BookDto>) {
    await this.one(id);
    return this.p.book.update({ where: { id }, data: d, include: bookInclude });
  }
  @Delete(":id")
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async remove(@Param("id") id: string) {
    await this.one(id);
    await this.p.book.delete({ where: { id } });
    return { message: "Book deleted" };
  }
}
@Controller("categories")
class CategoriesController {
  constructor(private p: PrismaService) {}
  @Get() all() {
    return this.p.category.findMany({ orderBy: { name: "asc" } });
  }
  @Post() @UseGuards(JwtGuard, RolesGuard) @Roles(Role.ADMIN) create(
    @Body() d: CategoryDto,
  ) {
    return this.p.category.create({ data: d });
  }
  @Patch(":id") @UseGuards(JwtGuard, RolesGuard) @Roles(Role.ADMIN) update(
    @Param("id") id: string,
    @Body() d: CategoryDto,
  ) {
    return this.p.category.update({ where: { id }, data: d });
  }
  @Delete(":id")
  @UseGuards(JwtGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async delete(@Param("id") id: string) {
    const c = await this.p.category.findUnique({
      where: { id },
      include: { _count: { select: { books: true } } },
    });
    if (!c) throw new NotFoundException("Category not found");
    if (c._count.books)
      throw new BadRequestException("Cannot delete category with books");
    await this.p.category.delete({ where: { id } });
    return { message: "Category deleted" };
  }
}
@Controller("cart")
@UseGuards(JwtGuard)
class CartController {
  constructor(private p: PrismaService) {}
  private get(userId: string) {
    return this.p.cart.upsert({
      where: { userId },
      create: { userId },
      update: {},
      include: cartInclude,
    });
  }
  @Get() getCart(@Req() r: any) {
    return this.get(r.user.sub);
  }
  @Post("items") async add(@Req() r: any, @Body() d: CartItemDto) {
    const b = await this.p.book.findUnique({ where: { id: d.bookId } });
    if (!b) throw new NotFoundException("Book not found");
    if (b.stock < d.quantity)
      throw new BadRequestException("Insufficient stock");
    const cart = await this.get(r.user.sub);
    await this.p.cartItem.upsert({
      where: { cartId_bookId: { cartId: cart.id, bookId: d.bookId } },
      create: { cartId: cart.id, bookId: d.bookId, quantity: d.quantity },
      update: { quantity: { increment: d.quantity } },
    });
    return this.get(r.user.sub);
  }
  @Patch("items/:bookId") async update(
    @Req() r: any,
    @Param("bookId") bookId: string,
    @Body() d: QuantityDto,
  ) {
    const cart = await this.get(r.user.sub);
    const b = await this.p.book.findUnique({ where: { id: bookId } });
    if (!b || b.stock < d.quantity)
      throw new BadRequestException("Insufficient stock");
    await this.p.cartItem.update({
      where: { cartId_bookId: { cartId: cart.id, bookId } },
      data: { quantity: d.quantity },
    });
    return this.get(r.user.sub);
  }
  @Delete("items/:bookId") async remove(
    @Req() r: any,
    @Param("bookId") bookId: string,
  ) {
    const c = await this.get(r.user.sub);
    await this.p.cartItem.deleteMany({ where: { cartId: c.id, bookId } });
    return this.get(r.user.sub);
  }
  @Delete() async clear(@Req() r: any) {
    const c = await this.get(r.user.sub);
    await this.p.cartItem.deleteMany({ where: { cartId: c.id } });
    return { message: "Cart cleared" };
  }
}
@Controller("orders")
@UseGuards(JwtGuard)
class OrdersController {
  constructor(private p: PrismaService) {}
  @Post() async checkout(@Req() r: any, @Body() d: CheckoutDto) {
    return this.p.$transaction(async (tx) => {
      const cart = await tx.cart.findUnique({
        where: { userId: r.user.sub },
        include: { items: { include: { book: true } } },
      });
      if (!cart?.items.length) throw new BadRequestException("Cart is empty");
      let total = 0;
      for (const i of cart.items) {
        if (i.book.stock < i.quantity)
          throw new BadRequestException(
            `Insufficient stock for ${i.book.title}`,
          );
        total += Number(i.book.price) * i.quantity;
      }
      const order = await tx.order.create({
        data: {
          userId: r.user.sub,
          recipientName: d.recipientName,
          phone: d.phone,
          landmark: d.landmark,
          shippingAddress: d.shippingAddress,
          totalAmount: total,
          items: {
            create: cart.items.map((i) => ({
              bookId: i.bookId,
              quantity: i.quantity,
              price: i.book.price,
            })),
          },
        },
        include: orderInclude,
      });
      for (const i of cart.items)
        await tx.book.update({
          where: { id: i.bookId },
          data: { stock: { decrement: i.quantity } },
        });
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
      return order;
    });
  }
  @Get() all(@Req() r: any) {
    return this.p.order.findMany({
      where: { userId: r.user.sub },
      include: orderInclude,
      orderBy: { createdAt: "desc" },
    });
  }
  @Get(":id") async one(@Req() r: any, @Param("id") id: string) {
    const order = await this.p.order.findFirst({
      where: { id, userId: r.user.sub },
      include: orderInclude,
    });
    if (!order) throw new NotFoundException("Order not found");
    return order;
  }
}
@Controller("admin")
@UseGuards(JwtGuard, RolesGuard)
@Roles(Role.ADMIN)
class AdminController {
  constructor(private p: PrismaService) {}
  @Get("dashboard") async dashboard() {
    const [users, books, orders, revenue] = await this.p.$transaction([
      this.p.user.count(),
      this.p.book.count(),
      this.p.order.count(),
      this.p.order.aggregate({ _sum: { totalAmount: true } }),
    ]);
    return {
      users,
      books,
      orders,
      revenue: Number(revenue._sum.totalAmount || 0),
    };
  }
  @Get("users") users() {
    return this.p.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }
  @Get("orders") orders() {
    return this.p.order.findMany({
      include: {
        user: { select: { name: true, email: true } },
        items: { include: { book: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }
  @Patch("orders/:id/status") status(
    @Param("id") id: string,
    @Body() d: StatusDto,
  ) {
    return this.p.order.update({ where: { id }, data: { status: d.status } });
  }
}
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ["../../.env", ".env"],
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || "dev-secret",
      signOptions: { expiresIn: (process.env.JWT_EXPIRES_IN || "7d") as any },
    }),
  ],
  controllers: [
    HealthController,
    AuthController,
    BooksController,
    CategoriesController,
    CartController,
    OrdersController,
    AdminController,
  ],
  providers: [PrismaService, JwtGuard, RolesGuard],
})
export class AppModule {}
