import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OnEvent } from '@nestjs/event-emitter';
import * as nodemailer from 'nodemailer';
import { SettingsService } from '../settings/settings.service';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private configService: ConfigService,
    private settingsService: SettingsService,
  ) {}

  private async getTransporterAndFromAddress() {
    try {
      const dbSettings = await this.settingsService.getRawSettings();

      if (dbSettings && dbSettings.emailProvider && dbSettings.emailProvider !== 'none') {
        if (dbSettings.emailProvider === 'google') {
          const user = dbSettings.gmailUser;
          const clientId = dbSettings.googleClientId;
          const clientSecret = dbSettings.googleClientSecret;
          const refreshToken = dbSettings.googleRefreshToken;

          if (user && clientId && clientSecret && refreshToken) {
            const transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                type: 'OAuth2',
                user,
                clientId,
                clientSecret,
                refreshToken,
              },
            });
            const fromName = dbSettings.smtpFromName || 'NwamCheap';
            const fromEmail = dbSettings.smtpFromEmail || user;
            return { transporter, fromAddress: `"${fromName}" <${fromEmail}>` };
          }
        } else if (dbSettings.emailProvider === 'smtp') {
          const host = dbSettings.smtpHost;
          const port = dbSettings.smtpPort;
          const username = dbSettings.smtpUsername;
          const password = dbSettings.smtpPassword;

          if (host && username && password) {
            const transporter = nodemailer.createTransport({
              host,
              port,
              secure: port === 465,
              auth: {
                user: username,
                pass: password,
              },
            });
            const fromName = dbSettings.smtpFromName || 'NwamCheap';
            const fromEmail = dbSettings.smtpFromEmail || username;
            return { transporter, fromAddress: `"${fromName}" <${fromEmail}>` };
          }
        }
      }
    } catch (err) {
      this.logger.error(`Error loading database settings: ${err.message}`);
    }

    // Fallback to environment variables
    const smtpHost = this.configService.get('smtp.host') || 'smtp.gmail.com';
    const smtpPort = this.configService.get('smtp.port') || 587;
    const smtpUsername = this.configService.get('smtp.username');
    const smtpPassword = this.configService.get('smtp.password');
    const fromName = this.configService.get('smtp.fromName', 'NwamCheap');
    const fromEmail = this.configService.get('smtp.fromEmail') || smtpUsername;

    if (smtpUsername && smtpPassword) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUsername,
          pass: smtpPassword,
        },
      });
      return { transporter, fromAddress: `"${fromName}" <${fromEmail}>` };
    }

    return { transporter: null, fromAddress: null };
  }

  async sendEmail(to: string, subject: string, html: string) {
    const { transporter, fromAddress } = await this.getTransporterAndFromAddress();

    if (!transporter || !fromAddress) {
      this.logger.warn(`Email not sent (no transporter configured): ${subject}`);
      return;
    }

    try {
      await transporter.sendMail({ from: fromAddress, to, subject, html });
      this.logger.log(`Email sent to ${to}: ${subject}`);
    } catch (error) {
      this.logger.error(`Failed to send email: ${error.message}`);
    }
  }

  async sendVerificationEmail(to: string, token: string, locale: string = 'ar') {
    const frontendUrl = this.configService.get('frontendUrl', 'https://shop.greatapps.online');
    const verifyUrl = `${frontendUrl}/${locale}/auth/verify?token=${token}`;

    const subject = locale === 'ar' ? 'تأكيد بريدك الإلكتروني - NwamCheap' : 'Verify your email - NwamCheap';
    const html = `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 24px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 32px; border-radius: 16px 16px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">✦ NwamCheap</h1>
        </div>
        <div style="background: white; padding: 32px; border-radius: 0 0 16px 16px;">
          <h2 style="font-size: 20px; color: #333;">${locale === 'ar' ? 'تأكيد بريدك الإلكتروني' : 'Verify Your Email'}</h2>
          <p style="font-size: 15px; color: #666; line-height: 1.8;">
            ${locale === 'ar' ? 'مرحباً! يرجى الضغط على الزر أدناه لتأكيد بريدك الإلكتروني.' : 'Hello! Please click the button below to verify your email address.'}
          </p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${verifyUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 40px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 16px;">
              ${locale === 'ar' ? 'تأكيد البريد' : 'Verify Email'}
            </a>
          </div>
          <p style="font-size: 12px; color: #999;">${locale === 'ar' ? 'ينتهي هذا الرابط خلال 24 ساعة.' : 'This link expires in 24 hours.'}</p>
        </div>
      </div>
    `;
    await this.sendEmail(to, subject, html);
  }

  async sendPasswordResetEmail(to: string, token: string, locale: string = 'ar') {
    const frontendUrl = this.configService.get('frontendUrl', 'https://shop.greatapps.online');
    const resetUrl = `${frontendUrl}/${locale}/auth/reset-password?token=${token}`;

    const subject = locale === 'ar' ? 'إعادة تعيين كلمة المرور - NwamCheap' : 'Reset Password - NwamCheap';
    const html = `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 24px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 32px; border-radius: 16px 16px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">✦ NwamCheap</h1>
        </div>
        <div style="background: white; padding: 32px; border-radius: 0 0 16px 16px;">
          <h2 style="font-size: 20px; color: #333;">${locale === 'ar' ? 'إعادة تعيين كلمة المرور' : 'Reset Your Password'}</h2>
          <p style="font-size: 15px; color: #666; line-height: 1.8;">
            ${locale === 'ar' ? 'اضغط على الزر أدناه لإعادة تعيين كلمة المرور.' : 'Click the button below to reset your password.'}
          </p>
          <div style="text-align: center; margin: 32px 0;">
            <a href="${resetUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 40px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 16px;">
              ${locale === 'ar' ? 'إعادة التعيين' : 'Reset Password'}
            </a>
          </div>
        </div>
      </div>
    `;
    await this.sendEmail(to, subject, html);
  }

  @OnEvent('order.created')
  async handleOrderCreated(payload: { order: any; userEmail: string }) {
    const { order, userEmail } = payload;
    if (!userEmail) return;
    const html = this.getOrderConfirmationTemplate(order);
    await this.sendEmail(userEmail, `Order #${order.orderNumber} Confirmed | تأكيد الطلب`, html);
  }

  @OnEvent('order.statusUpdated')
  async handleStatusUpdate(payload: { order: any; status: string; userEmail: string }) {
    const { order, status, userEmail } = payload;
    if (!userEmail) return;
    await this.sendEmail(userEmail, `Order #${order.orderNumber} - Status: ${status}`,
      `<p>Your order <strong>#${order.orderNumber}</strong> status has been updated to: <strong>${status}</strong></p>`);
  }

  @OnEvent('order.paymentUpdated')
  async handlePaymentUpdate(payload: { order: any; paymentStatus: string; userEmail: string }) {
    const { order, paymentStatus, userEmail } = payload;
    if (!userEmail) return;
    await this.sendEmail(userEmail, `Payment ${paymentStatus} - Order #${order.orderNumber}`,
      `<p>Payment for order <strong>#${order.orderNumber}</strong> has been <strong>${paymentStatus}</strong>.</p>`);
  }

  private getOrderConfirmationTemplate(order: any): string {
    const frontendUrl = this.configService.get('frontendUrl', 'https://shop.greatapps.online');
    return `
      <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 24px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 32px; border-radius: 16px 16px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px;">✦ NwamCheap</h1>
          <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0;">تأكيد الطلب | Order Confirmed</p>
        </div>
        <div style="background: white; padding: 32px; border-radius: 0 0 16px 16px;">
          <p style="font-size: 16px; color: #333;">رقم الطلب / Order #: <strong>${order.orderNumber}</strong></p>
          <p style="font-size: 16px; color: #333;">المبلغ / Total: <strong>${order.total} ${order.currency}</strong></p>
          <p style="font-size: 14px; color: #666;">شكراً لتسوقك معنا / Thank you for shopping with us!</p>
          <div style="text-align: center; margin-top: 24px;">
            <a href="${frontendUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 32px; border-radius: 8px; text-decoration: none; font-weight: 600;">
              View Order
            </a>
          </div>
        </div>
      </div>
    `;
  }
}
