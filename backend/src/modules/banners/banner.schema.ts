import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Banner extends Document {
  @Prop({ type: Object }) title: { ar: string; en: string };
  @Prop({ type: Object }) subtitle: { ar: string; en: string };
  @Prop() image: string;
  @Prop() mobileImage: string;
  @Prop() link: string;
  @Prop({ default: true }) isActive: boolean;
  @Prop({ default: 0 }) sortOrder: number;
  @Prop() startDate: Date;
  @Prop() endDate: Date;
}

export const BannerSchema = SchemaFactory.createForClass(Banner);
