import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Coupon, CouponDocument } from './coupon.schema';
import { CouponType } from '../../common/constants';

@Injectable()
export class CouponsService {
  constructor(@InjectModel(Coupon.name) private couponModel: Model<CouponDocument>) {}

  async create(data: Partial<Coupon>) { return this.couponModel.create(data); }

  async findAll() { return this.couponModel.find().sort({ createdAt: -1 }); }

  async validate(code: string, userId: string, orderTotal: number) {
    const coupon = await this.couponModel.findOne({ code: code.toUpperCase(), isActive: true });
    if (!coupon) throw new NotFoundException('Coupon not found');
    if (new Date() > coupon.expiresAt) throw new BadRequestException('Coupon expired');
    if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) throw new BadRequestException('Coupon usage limit reached');
    if (coupon.usedBy.includes(userId)) throw new BadRequestException('You already used this coupon');
    if (coupon.minOrderValue && orderTotal < coupon.minOrderValue) throw new BadRequestException(`Minimum order value is ${coupon.minOrderValue}`);

    let discount = coupon.type === CouponType.PERCENTAGE
      ? (orderTotal * coupon.value) / 100
      : coupon.value;

    if (coupon.maxDiscount && discount > coupon.maxDiscount) discount = coupon.maxDiscount;
    return { coupon, discount: Math.round(discount * 100) / 100 };
  }

  async use(code: string, userId: string) {
    await this.couponModel.findOneAndUpdate(
      { code: code.toUpperCase() },
      { $inc: { usedCount: 1 }, $push: { usedBy: userId } },
    );
  }

  async update(id: string, data: Partial<Coupon>) {
    const coupon = await this.couponModel.findByIdAndUpdate(id, data, { new: true });
    if (!coupon) throw new NotFoundException('Coupon not found');
    return coupon;
  }

  async delete(id: string) { await this.couponModel.findByIdAndDelete(id); }
}
