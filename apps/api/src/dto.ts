import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from "class-validator";
import { Type } from "class-transformer";
import { OrderStatus } from "@prisma/client";
export class RegisterDto {
  @IsString() @MinLength(2) name!: string;
  @IsEmail() email!: string;
  @IsString() @MinLength(8) password!: string;
}
export class LoginDto {
  @IsEmail() email!: string;
  @IsString() password!: string;
}
export class BookDto {
  @IsString() title!: string;
  @IsString() author!: string;
  @IsString() description!: string;
  @IsString() isbn!: string;
  @Type(() => Number) @IsNumber() @Min(0) price!: number;
  @IsString() imageUrl!: string;
  @Type(() => Number) @IsInt() @Min(0) stock!: number;
  @Type(() => Number) @IsNumber() @Min(0) rating!: number;
  @IsString() categoryId!: string;
}
export class CategoryDto {
  @IsString() @MinLength(2) name!: string;
  @IsOptional() @IsString() description?: string;
}
export class CartItemDto {
  @IsString() bookId!: string;
  @Type(() => Number) @IsInt() @Min(1) quantity!: number;
}
export class QuantityDto {
  @Type(() => Number) @IsInt() @Min(1) quantity!: number;
}
export class CheckoutDto {
  @IsString() @MinLength(2) recipientName!: string;
  @IsString() @MinLength(8) phone!: string;
  @IsOptional() @IsString() landmark?: string;
  @IsString() @MinLength(10) shippingAddress!: string;
}
export class StatusDto {
  @IsEnum(OrderStatus) status!: OrderStatus;
}
