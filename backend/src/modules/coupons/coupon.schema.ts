import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { CouponType } from '../../common/constants';

export type CouponDocument = Coupon & Document;

@Schema({ timestamps: true })
export class Coupon {
  @Prop({ required: true, unique: true, uppercase: true })
  code: string;

  @Prop({ type: { ar: String, en: String } })
  description: { ar: string; en: string };

  @Prop({ type: String, enum: CouponType, required: true })
  type: CouponType;

  @Prop({ required: true })
  value: number;

  @Prop({ type: Number })
  minOrderValue: number;

  @Prop({ type: Number })
  maxDiscount: number;

  @Prop({ type: Date, required: true })
  expiresAt: Date;

  @Prop({ type: Number, default: -1 })
  usageLimit: number;

  @Prop({ type: Number, default: 0 })
  usedCount: number;

  @Prop({ type: [String], default: [] })
  usedBy: string[];

  @Prop({ default: true })
  isActive: boolean;
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);
