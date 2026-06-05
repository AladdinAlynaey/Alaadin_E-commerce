import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateCurrencyRateDto {
  @IsNumber() rate: number;
}

export class CreateCurrencyDto {
  @IsString() code: string;
  @IsOptional() name?: { ar: string; en: string };
  @IsString() symbol: string;
  @IsNumber() rate: number;
  @IsOptional() isDefault?: boolean;
}
