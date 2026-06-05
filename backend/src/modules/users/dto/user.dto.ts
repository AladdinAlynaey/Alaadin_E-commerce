import { IsString, IsOptional, IsBoolean, IsEmail, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional() name?: { ar: string; en: string };
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() avatar?: string;
}

export class UpdateUserRoleDto {
  @IsString() role: string;
}

export class CreateAddressDto {
  @IsOptional() name?: { ar: string; en: string };
  @IsString() street: string;
  @IsString() city: string;
  @IsString() state: string;
  @IsString() country: string;
  @IsOptional() @IsString() zipCode?: string;
  @IsString() phone: string;
  @IsOptional() @IsBoolean() isDefault?: boolean;
}

export class ChangePasswordDto {
  @IsString()
  currentPassword: string;

  @IsString()
  @MinLength(12, { message: 'New password must be at least 12 characters long' })
  newPassword: string;
}
