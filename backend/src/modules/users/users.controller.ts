import { Controller, Get, Put, Body, Param, Query, UseGuards, Delete } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../../common/constants';
import { UsersService } from './users.service';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { ChangePasswordDto } from './dto/user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@CurrentUser() user: any) {
    return this.usersService.findById(user._id);
  }

  @Put('profile')
  @UseGuards(AuthGuard('jwt'))
  updateProfile(@CurrentUser() user: any, @Body() body: any) {
    return this.usersService.update(user._id, body);
  }

  @Put('profile/password')
  @UseGuards(AuthGuard('jwt'))
  changePassword(@CurrentUser() user: any, @Body() changePasswordDto: ChangePasswordDto) {
    return this.usersService.changePassword(
      user._id,
      changePasswordDto.currentPassword,
      changePasswordDto.newPassword,
    );
  }

  @Put('preferences')
  @UseGuards(AuthGuard('jwt'))
  updatePreferences(@CurrentUser() user: any, @Body() body: any) {
    return this.usersService.updatePreferences(user._id, body);
  }

  @Put('addresses')
  @UseGuards(AuthGuard('jwt'))
  addAddress(@CurrentUser() user: any, @Body() body: any) {
    return this.usersService.addAddress(user._id, body);
  }

  @Delete('addresses/:index')
  @UseGuards(AuthGuard('jwt'))
  removeAddress(@CurrentUser() user: any, @Param('index') index: number) {
    return this.usersService.removeAddress(user._id, index);
  }

  // Admin endpoints
  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  findAll(@Query() query: PaginationDto) {
    return this.usersService.findAll(query);
  }

  @Get('stats')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  getStats() {
    return this.usersService.getStats();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  update(@Param('id') id: string, @Body() body: any) {
    return this.usersService.update(id, body);
  }
}
