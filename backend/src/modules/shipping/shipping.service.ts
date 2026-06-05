import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ShippingZone, ShippingZoneDocument } from './shipping-zone.schema';

@Injectable()
export class ShippingService {
  constructor(@InjectModel(ShippingZone.name) private zoneModel: Model<ShippingZoneDocument>) {}

  async findAll() { return this.zoneModel.find({ isActive: true }); }

  async getFeeByCity(city: string) {
    const zone = await this.zoneModel.findOne({ cities: { $in: [city] }, isActive: true });
    if (!zone) return { fee: 0, estimatedDelivery: null };
    return { fee: zone.fee, estimatedDelivery: zone.estimatedDelivery, zone: zone.name };
  }

  async create(data: Partial<ShippingZone>) { return this.zoneModel.create(data); }
  async update(id: string, data: Partial<ShippingZone>) {
    const zone = await this.zoneModel.findByIdAndUpdate(id, data, { new: true });
    if (!zone) throw new NotFoundException('Zone not found');
    return zone;
  }
  async delete(id: string) { await this.zoneModel.findByIdAndDelete(id); }
}
