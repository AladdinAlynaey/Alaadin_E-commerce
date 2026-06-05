import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema({ timestamps: true })
export class Category {
  @Prop({ type: { ar: String, en: String }, required: true })
  name: { ar: string; en: string };

  @Prop({ type: { ar: String, en: String } })
  description: { ar: string; en: string };

  @Prop({ type: { ar: String, en: String }, unique: true })
  slug: { ar: string; en: string };

  @Prop({ type: String })
  image: string;

  @Prop({ type: Types.ObjectId, ref: 'Category', default: null })
  parent: Types.ObjectId;

  @Prop({ default: 0 })
  order: number;

  @Prop({ default: true })
  isActive: boolean;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
CategorySchema.index({ parent: 1 });
