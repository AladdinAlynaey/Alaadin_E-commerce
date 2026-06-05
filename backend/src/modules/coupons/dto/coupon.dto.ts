import { IsString, IsNumber, IsOptional, IsBoolean, IsDate } from 'class-validator';

export class CreateCouponDto {
  @IsString() code: string;
  @IsString() type: string;
  @IsNumber() value: number;
  @IsOptional() @IsNumber() minOrderValue?: number;
  @IsOptional() @IsNumber() maxDiscount?: number;
  @IsOptional() @IsNumber() usageLimit?: number;
  @IsOptional() expiresAt?: Date;
  @IsOptional() @IsBoolean() isActive?: boolean;
}
