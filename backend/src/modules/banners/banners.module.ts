import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BannersService } from './banners.service';
import { BannersController } from './banners.controller';
import { BannerSchema } from './banner.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Banner', schema: BannerSchema }])],
  controllers: [BannersController],
  providers: [BannersService],
  exports: [BannersService],
})
export class BannersModule {}
