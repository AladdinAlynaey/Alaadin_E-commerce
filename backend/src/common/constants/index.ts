export enum UserRole {
  CUSTOMER = 'customer',
  ADMIN = 'admin',
  SUPERADMIN = 'superadmin',
}

export enum OrderStatus {
  PENDING = 'pending',
  PAYMENT_UPLOADED = 'payment_uploaded',
  PAYMENT_APPROVED = 'payment_approved',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

export enum PaymentStatus {
  PENDING = 'pending',
  UPLOADED = 'uploaded',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum CouponType {
  PERCENTAGE = 'percentage',
  FIXED = 'fixed',
}

export enum CurrencyCode {
  YER = 'YER',
  SAR = 'SAR',
  USD = 'USD',
}

export const SUPPORTED_LANGUAGES = ['ar', 'en'] as const;
export const DEFAULT_LANGUAGE = 'ar';
export const DEFAULT_CURRENCY = CurrencyCode.YER;
