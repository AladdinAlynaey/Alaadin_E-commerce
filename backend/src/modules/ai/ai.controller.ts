import { Controller, Post, Body, Query } from '@nestjs/common';
import { AiService } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('chat')
  chat(@Body('messages') messages: any[], @Query('lang') lang: string) {
    return this.aiService.chat(messages, lang);
  }

  @Post('recommendations')
  recommendations(@Body('userId') userId: string, @Body('productIds') productIds: string[]) {
    return this.aiService.getRecommendations(userId, productIds);
  }

  @Post('image-search')
  imageSearch(@Body('image') imageBase64: string) {
    return this.aiService.imageSearch(imageBase64);
  }
}
