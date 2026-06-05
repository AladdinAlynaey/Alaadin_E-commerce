import createNextIntlPlugin from 'next-intl/plugin';
import type { NextConfig } from 'next';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  allowedDevOrigins: ['161.97.133.241'],
  images: {
    remotePatterns: [
      { protocol: 'http' as const, hostname: 'localhost', port: '5030' },
      { protocol: 'https' as const, hostname: 'shop.greatapps.online' },
    ],
  },
  devIndicators: false,
};

export default withNextIntl(nextConfig);
