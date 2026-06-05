import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CartDocument = Cart & Document;

@Schema({ timestamps: true })
export class Cart {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  user: Types.ObjectId;

  @Prop({
    type: [{
      product: { type: Types.ObjectId, ref: 'Product' },
      variant: { size: String, color: String },
      quantity: { type: Number, default: 1, min: 1 },
    }],
    default: [],
  })
  items: { product: Types.ObjectId; variant: { size: string; color: string }; quantity: number }[];

  @Prop({
    type: [{
      product: { type: Types.ObjectId, ref: 'Product' },
      variant: { size: String, color: String },
    }],
    default: [],
  })
  savedForLater: { product: Types.ObjectId; variant: { size: string; color: string } }[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);
