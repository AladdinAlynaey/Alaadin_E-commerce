import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../../common/constants';
import { OrdersService } from './orders.service';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@CurrentUser() user: any, @Body() body: any) {
    return this.ordersService.create(user._id, body);
  }

  @Get('my-orders')
  @UseGuards(AuthGuard('jwt'))
  findMyOrders(@CurrentUser() user: any, @Query() query: PaginationDto) {
    return this.ordersService.findByUser(user._id, query);
  }

  @Get('stats')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  getStats() { return this.ordersService.getStats(); }

  @Get('revenue')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  getRevenue(@Query('period') period: any, @Query('days') days: number) {
    return this.ordersService.getRevenueByPeriod(period, days);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  findAll(@Query() query: PaginationDto & any) { return this.ordersService.findAll(query); }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('id') id: string) { return this.ordersService.findById(id); }

  @Put(':id/status')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  updateStatus(@Param('id') id: string, @Body('status') status: any) {
    return this.ordersService.updateStatus(id, status);
  }

  @Put(':id/payment-status')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  updatePaymentStatus(@Param('id') id: string, @Body('paymentStatus') paymentStatus: any) {
    return this.ordersService.updatePaymentStatus(id, paymentStatus);
  }

  @Put(':id/payment-proof')
  @UseGuards(AuthGuard('jwt'))
  uploadPaymentProof(@Param('id') id: string, @Body('proofPath') proofPath: string) {
    return this.ordersService.uploadPaymentProof(id, proofPath);
  }
}
