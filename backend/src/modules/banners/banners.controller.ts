import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { BannersService } from './banners.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('banners')
export class BannersController {
  constructor(private bannersService: BannersService) {}

  @Get() findActive() { return this.bannersService.findActive(); }

  @Post() @UseGuards(AuthGuard('jwt'))
  create(@Body() data: any) { return this.bannersService.create(data); }

  @Put(':id') @UseGuards(AuthGuard('jwt'))
  update(@Param('id') id: string, @Body() data: any) { return this.bannersService.update(id, data); }

  @Delete(':id') @UseGuards(AuthGuard('jwt'))
  delete(@Param('id') id: string) { return this.bannersService.delete(id); }
}
