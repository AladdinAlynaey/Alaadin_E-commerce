import { IsNumber, IsString, Min, Max, IsOptional } from 'class-validator';

export class CreateReviewDto {
  @IsString() product: string;
  @IsNumber() @Min(1) @Max(5) rating: number;
  @IsOptional() @IsString() comment?: string;
}
