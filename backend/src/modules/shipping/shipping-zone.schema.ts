import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ShippingZoneDocument = ShippingZone & Document;

@Schema({ timestamps: true })
export class ShippingZone {
  @Prop({ type: { ar: String, en: String }, required: true })
  name: { ar: string; en: string };

  @Prop({ type: [String], required: true })
  cities: string[];

  @Prop({ type: Number, required: true })
  fee: number;

  @Prop({ type: String, default: 'YER' })
  currency: string;

  @Prop({ type: { ar: String, en: String } })
  estimatedDelivery: { ar: string; en: string };

  @Prop({ default: true })
  isActive: boolean;
}

export const ShippingZoneSchema = SchemaFactory.createForClass(ShippingZone);
