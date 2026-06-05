import { IsString, IsOptional, IsNumber, IsBoolean, IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';

class LocalizedField { @IsString() ar: string; @IsString() en: string; }
class PriceField { @IsNumber() YER: number; @IsNumber() @IsOptional() SAR?: number; @IsNumber() @IsOptional() USD?: number; }
class VariantDto { @IsString() size: string; @IsOptional() color?: any; @IsNumber() @Min(0) stock: number; @IsOptional() sku?: string; }

export class CreateProductDto {
  @ValidateNested() @Type(() => LocalizedField) name: LocalizedField;
  @ValidateNested() @Type(() => LocalizedField) description: LocalizedField;
  @ValidateNested() @Type(() => PriceField) price: PriceField;
  @IsOptional() @ValidateNested() @Type(() => PriceField) compareAtPrice?: PriceField;
  @IsString() category: string;
  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => VariantDto) variants?: VariantDto[];
  @IsOptional() @IsArray() @IsString({ each: true }) tags?: string[];
  @IsOptional() @IsArray() @IsString({ each: true }) images?: string[];
  @IsOptional() @IsBoolean() isFeatured?: boolean;
  @IsOptional() @IsBoolean() isFlashDeal?: boolean;
  @IsOptional() @IsBoolean() isActive?: boolean;
}

export class UpdateProductDto {
  @IsOptional() @ValidateNested() @Type(() => LocalizedField) name?: LocalizedField;
  @IsOptional() @ValidateNested() @Type(() => LocalizedField) description?: LocalizedField;
  @IsOptional() @ValidateNested() @Type(() => PriceField) price?: PriceField;
  @IsOptional() @IsString() category?: string;
  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => VariantDto) variants?: VariantDto[];
  @IsOptional() @IsBoolean() isFeatured?: boolean;
  @IsOptional() @IsBoolean() isFlashDeal?: boolean;
  @IsOptional() @IsBoolean() isActive?: boolean;
}
