export interface Product { _id: string; name: { ar: string; en: string }; description: { ar: string; en: string }; price: { YER: number; SAR?: number; USD?: number }; compareAtPrice?: { YER: number }; category: string; images: string[]; variants: { size: string; color?: any; stock: number }[]; tags: string[]; ratings: { average: number; count: number }; isFeatured: boolean; isFlashDeal: boolean; }
export interface User { _id: string; email: string; name: { ar: string; en: string }; role: string; phone?: string; }
export interface Order { _id: string; orderNumber: string; items: any[]; total: number; currency: string; orderStatus: string; paymentStatus: string; createdAt: string; shippingAddress?: any; }
export interface CartItem { productId: string; quantity: number; variant?: any; product?: Product; }
export interface Category { _id: string; name: { ar: string; en: string }; slug: { ar: string; en: string }; }
