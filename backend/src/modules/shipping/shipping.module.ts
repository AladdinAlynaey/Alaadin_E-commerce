import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ShippingZone, ShippingZoneSchema } from './shipping-zone.schema';
import { ShippingService } from './shipping.service';
import { ShippingController } from './shipping.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: ShippingZone.name, schema: ShippingZoneSchema }])],
  controllers: [ShippingController],
  providers: [ShippingService],
  exports: [ShippingService],
})
export class ShippingModule {}
