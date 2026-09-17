import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
  UnauthorizedException,
  ForbiddenException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Role } from "@prisma/client";
export const Roles = (...roles: Role[]) => SetMetadata("roles", roles);
@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private jwt: JwtService) {}
  canActivate(ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest();
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) throw new UnauthorizedException("Authentication required");
    try {
      req.user = this.jwt.verify(token, {
        secret: process.env.JWT_SECRET || "dev-secret",
      });
      return true;
    } catch {
      throw new UnauthorizedException("Invalid or expired token");
    }
  }
}
@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(ctx: ExecutionContext) {
    const roles: Role[] = Reflect.getMetadata("roles", ctx.getHandler()) || [];
    if (!roles.length) return true;
    const user = ctx.switchToHttp().getRequest().user;
    if (!user || !roles.includes(user.role))
      throw new ForbiddenException("Administrator access required");
    return true;
  }
}
