import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly apiKey: string;
  private readonly model: string;
  private readonly baseUrl: string;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get('openrouter.apiKey', '');
    this.model = this.configService.get('openrouter.model', 'google/gemini-3.1-pro-preview');
    this.baseUrl = this.configService.get('openrouter.baseUrl', 'https://openrouter.ai/api/v1');
  }

  private get isConfigured(): boolean {
    return !!this.apiKey;
  }

  async chat(messages: { role: string; content: string }[], language: string = 'ar') {
    if (!this.isConfigured) {
      return { reply: language === 'ar' ? 'مرحباً! كيف يمكنني مساعدتك؟' : 'Hello! How can I help you?', mock: true };
    }

    try {
      const systemPrompt = language === 'ar'
        ? 'أنت مساعد تسوق ذكي لمتجر ملابس. ساعد العملاء في العثور على المنتجات والإجابة على أسئلتهم باللغة العربية.'
        : 'You are a smart shopping assistant for a clothing store. Help customers find products and answer their questions.';

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': this.configService.get('frontendUrl', 'http://localhost:3000'),
        },
        body: JSON.stringify({
          model: this.model,
          messages: [{ role: 'system', content: systemPrompt }, ...messages],
          max_tokens: 500,
        }),
      });

      const data = await response.json();
      return { reply: data.choices?.[0]?.message?.content || 'No response', mock: false };
    } catch (error) {
      this.logger.error(`AI chat error: ${error.message}`);
      return { reply: language === 'ar' ? 'عذراً، حدث خطأ. حاول مرة أخرى.' : 'Sorry, an error occurred. Please try again.', mock: true };
    }
  }

  async getRecommendations(userId: string, productIds: string[] = []) {
    if (!this.isConfigured) {
      return { recommendations: [], mock: true };
    }
    // Would integrate with purchase history for real recommendations
    return { recommendations: [], mock: true };
  }

  async imageSearch(imageBase64: string) {
    if (!this.isConfigured) {
      return { results: [], mock: true };
    }

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: [{
            role: 'user',
            content: [
              { type: 'text', text: 'Describe this clothing item in detail: type, color, style, material. Return as JSON: { "type": "", "color": "", "style": "", "tags": [] }' },
              { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${imageBase64}` } },
            ],
          }],
        }),
      });

      const data = await response.json();
      return { description: data.choices?.[0]?.message?.content, mock: false };
    } catch (error) {
      this.logger.error(`Image search error: ${error.message}`);
      return { results: [], mock: true };
    }
  }
}
