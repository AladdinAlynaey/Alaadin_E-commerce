export const ALAADIN_CONFIG = {
  appName: { ar: 'نوام شيب', en: 'NwamCheap' },
  domain: 'shop.greatapps.online',
  apiUrl: 'https://shop.greatapps.online/api',
  supportEmail: 'support@shop.greatapps.online',
  defaultLocale: 'ar' as const,
  supportedLocales: ['ar', 'en'] as const,
  defaultCurrency: 'YER' as const,
  supportedCurrencies: ['YER', 'SAR', 'USD'] as const,
  pagination: { defaultLimit: 20, maxLimit: 100 },
  upload: { maxFileSize: 5 * 1024 * 1024, allowedTypes: ['image/jpeg', 'image/png', 'image/webp'] },
  jwt: { accessTokenExpiry: '15m', refreshTokenExpiry: '7d' },
};

export default ALAADIN_CONFIG;
