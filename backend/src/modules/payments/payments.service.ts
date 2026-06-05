import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import * as fs from 'fs';
import * as path from 'path';
import { SettingsService } from '../settings/settings.service';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private configService: ConfigService,
    private settingsService: SettingsService,
  ) {}

  @OnEvent('order.paymentProofUploaded')
  async handlePaymentProofUploaded(payload: { order: any }) {
    const { order } = payload;
    await this.sendToTelegram(order);
    await this.sendToN8n(order);
  }

  private async sendToTelegram(order: any) {
    let botToken = '';
    let chatId = '';

    try {
      const dbSettings = await this.settingsService.getRawSettings();
      botToken = dbSettings?.telegramBotToken || '';
      chatId = dbSettings?.telegramChatId || '';
    } catch (err) {
      this.logger.error(`Failed to load telegram settings from db: ${err.message}`);
    }

    if (!botToken || !chatId) {
      botToken = this.configService.get('telegram.botToken') || '';
      chatId = this.configService.get('telegram.chatId') || '';
    }

    if (!botToken || !chatId) {
      this.logger.warn('Telegram not configured, skipping notification');
      return;
    }

    try {
      const message = `🛒 *New Payment Proof Uploaded*\n\n` +
        `📦 Order: \`${order.orderNumber}\`\n` +
        `💰 Total: ${order.total} ${order.currency}\n` +
        `📅 Date: ${new Date(order.createdAt).toLocaleDateString()}\n` +
        `👤 User: ${order.user?.name?.en || order.user}\n\n` +
        `⏳ Awaiting admin approval`;

      // Send text message
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'Markdown' }),
      });

      // Send payment proof image if available
      if (order.paymentProof) {
        const uploadDir = this.configService.get('upload.dir', './uploads');
        const imagePath = path.join(uploadDir, order.paymentProof);

        if (fs.existsSync(imagePath)) {
          const formData = new FormData();
          formData.append('chat_id', chatId);
          formData.append('caption', `Payment proof for ${order.orderNumber}`);

          const imageBuffer = fs.readFileSync(imagePath);
          const blob = new Blob([imageBuffer], { type: 'image/webp' });
          formData.append('photo', blob, 'payment_proof.webp');

          await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
            method: 'POST',
            body: formData,
          });
        }
      }

      this.logger.log(`Telegram notification sent for order ${order.orderNumber}`);
    } catch (error) {
      this.logger.error(`Failed to send Telegram notification: ${error.message}`);
    }
  }

  private async sendToN8n(order: any) {
    const webhookUrl = this.configService.get('n8n.webhookUrl');
    if (!webhookUrl) return;

    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'payment_proof_uploaded',
          order: {
            orderNumber: order.orderNumber,
            total: order.total,
            currency: order.currency,
            paymentProof: order.paymentProof,
            userId: order.user,
          },
          timestamp: new Date().toISOString(),
        }),
      });
      this.logger.log(`n8n webhook triggered for order ${order.orderNumber}`);
    } catch (error) {
      this.logger.error(`Failed to trigger n8n webhook: ${error.message}`);
    }
  }
}
