import { IsString, IsNumber, IsOptional, IsArray } from 'class-validator';

export class CreateOrderDto {
  @IsArray() items: any[];
  @IsOptional() shippingAddress?: any;
  @IsOptional() @IsString() couponCode?: string;
  @IsOptional() @IsString() notes?: string;
  @IsNumber() subtotal: number;
  @IsOptional() @IsNumber() shippingFee?: number;
  @IsOptional() @IsNumber() discount?: number;
  @IsNumber() total: number;
  @IsString() currency: string;
}

export class UpdateOrderStatusDto {
  @IsString() orderStatus: string;
}

export class UpdatePaymentStatusDto {
  @IsString() paymentStatus: string;
}
