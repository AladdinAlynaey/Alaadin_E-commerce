import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserRole } from '../../common/constants';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ type: { ar: String, en: String }, required: true })
  name: { ar: string; en: string };

  @Prop({ trim: true })
  phone: string;

  @Prop({ type: String, enum: UserRole, default: UserRole.CUSTOMER })
  role: UserRole;

  @Prop({ type: String })
  avatar: string;

  @Prop({
    type: [{
      label: String,
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String,
      phone: String,
      isDefault: { type: Boolean, default: false },
    }],
    default: [],
  })
  addresses: {
    label: string;
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    phone: string;
    isDefault: boolean;
  }[];

  @Prop({
    type: {
      language: { type: String, default: 'ar' },
      theme: { type: String, default: 'system' },
      currency: { type: String, default: 'YER' },
    },
    default: { language: 'ar', theme: 'system', currency: 'YER' },
  })
  preferences: {
    language: string;
    theme: string;
    currency: string;
  };

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop({ type: String })
  emailVerificationToken: string;

  @Prop({ type: Date })
  emailVerificationExpires: Date;

  @Prop({ type: String })
  passwordResetToken: string;

  @Prop({ type: Date })
  passwordResetExpires: Date;

  @Prop({ type: String })
  refreshToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ email: 1 });
