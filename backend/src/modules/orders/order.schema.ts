import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { OrderStatus, PaymentStatus } from '../../common/constants';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true, unique: true })
  orderNumber: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({
    type: [{
      product: { type: Types.ObjectId, ref: 'Product' },
      name: { ar: String, en: String },
      price: Number,
      image: String,
      variant: { size: String, color: String },
      quantity: Number,
      subtotal: Number,
    }],
    required: true,
  })
  items: any[];

  @Prop({ type: { street: String, city: String, state: String, country: String, zipCode: String, phone: String } })
  shippingAddress: any;

  @Prop({ type: Number, required: true })
  subtotal: number;

  @Prop({ type: Number, default: 0 })
  shippingFee: number;

  @Prop({ type: Number, default: 0 })
  tax: number;

  @Prop({ type: Number, default: 0 })
  discount: number;

  @Prop({ type: Number, required: true })
  total: number;

  @Prop({ type: String, default: 'YER' })
  currency: string;

  @Prop({ type: String })
  couponCode: string;

  @Prop({ type: String, enum: PaymentStatus, default: PaymentStatus.PENDING })
  paymentStatus: PaymentStatus;

  @Prop({ type: String })
  paymentProof: string;

  @Prop({ type: String, enum: OrderStatus, default: OrderStatus.PENDING })
  orderStatus: OrderStatus;

  @Prop({ type: Date })
  estimatedDelivery: Date;

  @Prop({ type: String })
  notes: string;

  @Prop({ type: String })
  trackingNumber: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
OrderSchema.index({ user: 1, createdAt: -1 });
OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ orderStatus: 1 });
OrderSchema.index({ paymentStatus: 1 });
