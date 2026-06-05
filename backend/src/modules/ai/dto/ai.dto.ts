import { IsArray, IsString, IsOptional } from 'class-validator';

export class ChatDto {
  @IsArray() messages: { role: string; content: string }[];
  @IsOptional() @IsString() model?: string;
}

export class ImageSearchDto {
  @IsString() query: string;
  @IsOptional() limit?: number;
}
