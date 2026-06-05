import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Address extends Document {
  @Prop({ type: Object }) name: { ar: string; en: string };
  @Prop() userId: string;
  @Prop() street: string;
  @Prop() city: string;
  @Prop() state: string;
  @Prop() country: string;
  @Prop() zipCode: string;
  @Prop() phone: string;
  @Prop({ default: false }) isDefault: boolean;
}

export const AddressSchema = SchemaFactory.createForClass(Address);
