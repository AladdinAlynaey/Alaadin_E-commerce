import { IsString, IsNumber, IsOptional, IsArray, ValidateNested } from 'class-validator';

export class AddToCartDto {
  @IsString() productId: string;
  @IsNumber() quantity: number;
  @IsOptional() variant?: { size?: string; color?: string };
}

export class UpdateCartItemDto {
  @IsNumber() quantity: number;
}
