import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Setting, SettingDocument } from './setting.schema';

@Injectable()
export class SettingsService implements OnModuleInit {
  private readonly logger = new Logger(SettingsService.name);
  private readonly maskValue = '••••••••';
  private readonly sensitiveFields = [
    'googleClientSecret',
    'googleRefreshToken',
    'smtpPassword',
    'telegramBotToken',
  ];

  constructor(
    @InjectModel(Setting.name) private readonly settingModel: Model<SettingDocument>,
  ) {}

  async onModuleInit() {
    // Ensure at least one setting document exists
    await this.ensureSettingsExist();
  }

  private async ensureSettingsExist(): Promise<SettingDocument> {
    let settings = await this.settingModel.findOne();
    if (!settings) {
      this.logger.log('No settings found. Initializing default configuration...');
      settings = await this.settingModel.create({
        emailProvider: 'none',
        googleClientId: '',
        googleClientSecret: '',
        googleRefreshToken: '',
        gmailUser: '',
        smtpHost: '',
        smtpPort: 587,
        smtpUsername: '',
        smtpPassword: '',
        smtpFromEmail: '',
        smtpFromName: 'NwamCheap',
        telegramBotToken: '',
        telegramChatId: '',
      });
    }
    return settings;
  }

  // Returns unmasked settings for internal backend services (e.g. notifications)
  async getRawSettings(): Promise<SettingDocument> {
    return this.ensureSettingsExist();
  }

  // Returns settings with masked secrets for the client
  async getSettings(): Promise<any> {
    const settings = await this.ensureSettingsExist();
    const settingsObj = settings.toObject() as any;

    for (const field of this.sensitiveFields) {
      if (settingsObj[field]) {
        settingsObj[field] = this.maskValue;
      }
    }

    return settingsObj;
  }

  // Updates settings securely by ignoring masked inputs
  async updateSettings(updateData: Partial<Setting>): Promise<any> {
    const existing = await this.ensureSettingsExist();
    const cleanData: any = { ...updateData };

    for (const field of this.sensitiveFields) {
      if (cleanData[field] === this.maskValue) {
        // Do not update the field if the client sent the masked placeholder value
        delete cleanData[field];
      }
    }

    const updated = await this.settingModel.findByIdAndUpdate(
      existing._id,
      { $set: cleanData },
      { new: true },
    );

    return this.getSettings();
  }
}
