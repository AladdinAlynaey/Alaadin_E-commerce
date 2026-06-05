import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { CurrencyCode } from '../../common/constants';

export type CurrencyDocument = Currency & Document;

@Schema({ timestamps: true })
export class Currency {
  @Prop({ type: String, enum: CurrencyCode, required: true, unique: true })
  code: CurrencyCode;

  @Prop({ type: { ar: String, en: String }, required: true })
  name: { ar: string; en: string };

  @Prop({ required: true })
  symbol: string;

  @Prop({ type: Number, required: true, default: 1 })
  rate: number;

  @Prop({ default: false })
  isDefault: boolean;

  @Prop({ default: true })
  isActive: boolean;
}

export const CurrencySchema = SchemaFactory.createForClass(Currency);
