import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserRole } from '../../common/constants';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get('product/:productId')
  findByProduct(@Param('productId') productId: string, @Query('page') page: number, @Query('limit') limit: number) {
    return this.reviewsService.findByProduct(productId, page, limit);
  }

  @Post('product/:productId')
  @UseGuards(AuthGuard('jwt'))
  create(@CurrentUser() user: any, @Param('productId') productId: string, @Body() body: any) {
    return this.reviewsService.create(user._id, productId, body);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  findAll(@Query('page') page: number, @Query('limit') limit: number) {
    return this.reviewsService.findAll(page, limit);
  }

  @Put(':id/moderate')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  moderate(@Param('id') id: string, @Body('isApproved') isApproved: boolean) {
    return this.reviewsService.moderate(id, isApproved);
  }
}
