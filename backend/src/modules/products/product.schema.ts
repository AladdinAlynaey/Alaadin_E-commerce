import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
  @Prop({ type: { ar: String, en: String }, required: true })
  name: { ar: string; en: string };

  @Prop({ type: { ar: String, en: String }, required: true })
  description: { ar: string; en: string };

  @Prop({ type: { ar: String, en: String }, unique: true })
  slug: { ar: string; en: string };

  @Prop({ type: { YER: Number, SAR: Number, USD: Number }, required: true })
  price: { YER: number; SAR: number; USD: number };

  @Prop({ type: { YER: Number, SAR: Number, USD: Number } })
  compareAtPrice: { YER: number; SAR: number; USD: number };

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  category: Types.ObjectId;

  @Prop({ type: [String], default: [] })
  images: string[];

  @Prop({ type: [String], default: [] })
  videos: string[];

  @Prop({
    type: [{
      size: String,
      color: {
        name: { ar: String, en: String },
        hex: String,
      },
      sku: String,
      stock: { type: Number, default: 0 },
      priceOverride: { YER: Number, SAR: Number, USD: Number },
    }],
    default: [],
  })
  variants: {
    size: string;
    color: { name: { ar: string; en: string }; hex: string };
    sku: string;
    stock: number;
    priceOverride?: { YER: number; SAR: number; USD: number };
  }[];

  @Prop({ type: [{ key: { ar: String, en: String }, value: { ar: String, en: String } }], default: [] })
  specifications: { key: { ar: string; en: string }; value: { ar: string; en: string } }[];

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ type: { ar: String, en: String } })
  brand: { ar: string; en: string };

  @Prop({ type: { average: { type: Number, default: 0 }, count: { type: Number, default: 0 } }, default: { average: 0, count: 0 } })
  ratings: { average: number; count: number };

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isFeatured: boolean;

  @Prop({ default: false })
  isFlashDeal: boolean;

  @Prop({ type: Date })
  flashDealEnd: Date;

  @Prop({ type: { title: { ar: String, en: String }, description: { ar: String, en: String } } })
  seo: { title: { ar: string; en: string }; description: { ar: string; en: string } };

  @Prop({ type: Number, default: 0 })
  totalStock: number;

  @Prop({ type: Number, default: 0 })
  soldCount: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
ProductSchema.index({ 'name.ar': 'text', 'name.en': 'text', 'description.ar': 'text', 'description.en': 'text' });
ProductSchema.index({ category: 1 });
ProductSchema.index({ isActive: 1, isFeatured: 1 });
ProductSchema.index({ 'price.YER': 1 });
ProductSchema.index({ createdAt: -1 });
ProductSchema.index({ soldCount: -1 });
