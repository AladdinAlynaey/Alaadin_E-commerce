import { IsString, IsEmail, IsOptional, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail() email: string;
  @IsString() @MinLength(6) password: string;
}

export class RegisterDto {
  @IsEmail() email: string;
  @IsString() @MinLength(6) password: string;
  @IsOptional() name?: { ar: string; en: string };
  @IsOptional() @IsString() phone?: string;
}

export class UpdateProfileDto {
  @IsOptional() name?: { ar: string; en: string };
  @IsOptional() @IsString() phone?: string;
  @IsOptional() avatar?: string;
}
