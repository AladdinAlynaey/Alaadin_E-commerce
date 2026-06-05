import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SettingDocument = Setting & Document;

@Schema({ timestamps: true })
export class Setting {
  @Prop({ type: String, enum: ['smtp', 'google', 'none'], default: 'none' })
  emailProvider: string;

  // Google OAuth2
  @Prop({ trim: true, default: '' })
  googleClientId: string;

  @Prop({ trim: true, default: '' })
  googleClientSecret: string;

  @Prop({ trim: true, default: '' })
  googleRefreshToken: string;

  @Prop({ trim: true, default: '' })
  gmailUser: string;

  // SMTP Settings
  @Prop({ trim: true, default: '' })
  smtpHost: string;

  @Prop({ type: Number, default: 587 })
  smtpPort: number;

  @Prop({ trim: true, default: '' })
  smtpUsername: string;

  @Prop({ trim: true, default: '' })
  smtpPassword: string;

  @Prop({ trim: true, default: '' })
  smtpFromEmail: string;

  @Prop({ trim: true, default: 'NwamCheap' })
  smtpFromName: string;

  // Telegram
  @Prop({ trim: true, default: '' })
  telegramBotToken: string;

  @Prop({ trim: true, default: '' })
  telegramChatId: string;
}

export const SettingSchema = SchemaFactory.createForClass(Setting);
