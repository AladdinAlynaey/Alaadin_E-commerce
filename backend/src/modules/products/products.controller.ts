import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/constants';
import { ProductsService } from './products.service';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll(@Query() query: PaginationDto & any) {
    return this.productsService.findAll(query);
  }

  @Get('featured')
  getFeatured(@Query('limit') limit: number) {
    return this.productsService.getFeatured(limit);
  }

  @Get('flash-deals')
  getFlashDeals(@Query('limit') limit: number) {
    return this.productsService.getFlashDeals(limit);
  }

  @Get('best-selling')
  getBestSelling(@Query('limit') limit: number) {
    return this.productsService.getBestSelling(limit);
  }

  @Get('search')
  search(@Query('q') query: string, @Query('limit') limit: number) {
    return this.productsService.search(query, limit);
  }

  @Get('stats')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  getStats() {
    return this.productsService.getStats();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findById(id);
  }

  @Get(':id/related')
  getRelated(@Param('id') id: string, @Query('limit') limit: number) {
    return this.productsService.getRelated(id, limit);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  create(@Body() body: any) {
    return this.productsService.create(body);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  update(@Param('id') id: string, @Body() body: any) {
    return this.productsService.update(id, body);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.SUPERADMIN)
  remove(@Param('id') id: string) {
    return this.productsService.delete(id);
  }
}
