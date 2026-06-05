import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class BannersService {
  constructor(@InjectModel('Banner') private bannerModel: Model<any>) {}

  async findActive() {
    const now = new Date();
    return this.bannerModel.find({
      isActive: true,
      $or: [{ startDate: { $lte: now }, endDate: { $gte: now } }, { startDate: null, endDate: null }],
    }).sort({ sortOrder: 1 });
  }

  async create(data: any) { return this.bannerModel.create(data); }
  async update(id: string, data: any) { return this.bannerModel.findByIdAndUpdate(id, data, { new: true }); }
  async delete(id: string) { return this.bannerModel.findByIdAndDelete(id); }
}
