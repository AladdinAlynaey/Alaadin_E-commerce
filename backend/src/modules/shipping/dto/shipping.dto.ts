import { IsString, IsNumber, IsArray, IsOptional } from 'class-validator';

export class CreateShippingZoneDto {
  @IsOptional() name?: { ar: string; en: string };
  @IsArray() @IsString({ each: true }) cities: string[];
  @IsNumber() fee: number;
  @IsOptional() @IsString() currency?: string;
  @IsOptional() estimatedDelivery?: { ar: string; en: string };
}
