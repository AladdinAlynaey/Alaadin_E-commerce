export default () => ({
  port: parseInt(process.env.API_PORT || '', 10) || 5030,
  domain: process.env.DOMAIN || 'shop.greatapps.online',
  frontendUrl: process.env.FRONTEND_URL || 'https://shop.greatapps.online',

  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce',
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'default-secret',
    expiration: process.env.JWT_EXPIRATION || '7d',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'default-refresh-secret',
    refreshExpiration: process.env.JWT_REFRESH_EXPIRATION || '30d',
  },

  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN || '',
    gmailUser: process.env.GMAIL_USER || '',
    redirectUri: process.env.GOOGLE_REDIRECT_URI || '',
  },

  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '', 10) || 587,
    username: process.env.SMTP_USERNAME || '',
    password: process.env.SMTP_PASSWORD || '',
    fromEmail: process.env.SMTP_FROM_EMAIL || '',
    fromName: process.env.SMTP_FROM_NAME || 'NwamCheap',
  },

  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN || '',
    chatId: process.env.TELEGRAM_CHAT_ID || '',
  },

  n8n: {
    webhookUrl: process.env.N8N_WEBHOOK_URL || '',
  },

  openrouter: {
    apiKey: process.env.OPENROUTER_API_KEY || '',
    model: process.env.OPENROUTER_MODEL || 'google/gemini-3.1-pro-preview',
    baseUrl: process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1',
  },

  upload: {
    dir: process.env.UPLOAD_DIR || './uploads',
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '', 10) || 5242880,
  },

  throttle: {
    ttl: parseInt(process.env.THROTTLE_TTL || '', 10) || 60,
    limit: parseInt(process.env.THROTTLE_LIMIT || '', 10) || 100,
  },
});
