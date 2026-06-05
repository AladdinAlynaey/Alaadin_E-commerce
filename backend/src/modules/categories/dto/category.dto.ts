import { IsString, IsNumber, IsOptional, IsArray } from 'class-validator';

export class CreateCategoryDto {
  @IsOptional() name?: { ar: string; en: string };
  @IsOptional() slug?: { ar: string; en: string };
  @IsOptional() description?: { ar: string; en: string };
  @IsOptional() @IsString() parent?: string;
  @IsOptional() @IsString() icon?: string;
  @IsOptional() @IsNumber() sortOrder?: number;
}
