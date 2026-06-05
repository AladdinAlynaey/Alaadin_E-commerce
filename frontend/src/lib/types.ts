export interface Product {
  _id: string;
  name: { ar: string; en: string };
  description: { ar: string; en: string };
  price: { YER: number; SAR?: number; USD?: number };
  compareAtPrice?: { YER: number; SAR?: number; USD?: number };
  category: string;
  images: string[];
  variants: Variant[];
  tags: string[];
  ratings: { average: number; count: number };
  isFeatured: boolean;
  isFlashDeal: boolean;
  isActive: boolean;
  totalStock: number;
}

export interface Variant {
  size: string;
  color?: { name: { ar: string; en: string }; hex: string };
  stock: number;
  sku?: string;
}

export interface User {
  _id: string;
  email: string;
  name: { ar: string; en: string };
  role: 'customer' | 'admin' | 'superadmin';
  phone?: string;
  avatar?: string;
  isActive: boolean;
}

export interface Order {
  _id: string;
  orderNumber: string;
  user: string;
  items: OrderItem[];
  shippingAddress: Address;
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  currency: string;
  orderStatus: string;
  paymentStatus: string;
  paymentProof?: string;
  createdAt: string;
}

export interface OrderItem {
  product: string;
  name: { ar: string; en: string };
  price: number;
  quantity: number;
  variant?: { size?: string; color?: string };
  subtotal: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  country: string;
  zipCode?: string;
  phone: string;
}

export interface Category {
  _id: string;
  name: { ar: string; en: string };
  slug: { ar: string; en: string };
  parent?: string;
  icon?: string;
  sortOrder: number;
}

export interface CartItem {
  productId: string;
  quantity: number;
  variant?: { size?: string; color?: string };
  product?: Product;
}

export interface Coupon {
  _id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  minOrderValue: number;
  maxDiscount: number;
  usageLimit: number;
  usedCount: number;
  expiresAt: string;
  isActive: boolean;
}

export interface Currency {
  code: string;
  name: { ar: string; en: string };
  symbol: string;
  rate: number;
  isDefault: boolean;
}

export interface Review {
  _id: string;
  user: User;
  product: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string;
}
