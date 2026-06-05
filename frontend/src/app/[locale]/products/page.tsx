'use client';

import { useTranslations, useLocale } from 'next-intl';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import ProductCard from '@/components/product/ProductCard';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function ProductsPage() {
  const t = useTranslations('product');
  const tc = useTranslations('common');
  const locale = useLocale();
  const { formatPrice } = useCurrency();
  const { addItem } = useCart();
  const { token } = useAuth();

  const [products, setProducts] = useState<any[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);

  useEffect(() => {
    api.get<any>('/products?limit=20')
      .then(res => setProducts(res.data || []))
      .catch(() => {
        setProducts(Array.from({ length: 8 }, (_, i) => ({
          _id: `p-${i}`, name: { ar: `منتج ${i+1}`, en: `Product ${i+1}` },
          price: { YER: (i+1)*3500, SAR: (i+1)*35, USD: (i+1)*10 },
          images: [], ratings: { average: 4, count: 5+i*3 },
        })));
      });
  }, []);

  useEffect(() => {
    if (token) {
      api.get<any>('/wishlist', token)
        .then(res => {
          const ids = (res.products || []).map((p: any) => p._id);
          setWishlistIds(ids);
        })
        .catch(() => {});
    } else {
      setWishlistIds([]);
    }
  }, [token]);

  const handleToggleWishlist = async (productId: string) => {
    if (!token) {
      alert(locale === 'ar' ? 'الرجاء تسجيل الدخول أولاً' : 'Please login first');
      return;
    }
    try {
      await api.post(`/wishlist/${productId}`, {}, token);
      setWishlistIds(prev => 
        prev.includes(productId) 
          ? prev.filter(id => id !== productId)
          : [...prev, productId]
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Header />
      <main className="container section page-enter">
        <h1 className="section-title">{tc('products')}</h1>
        <div className="grid grid-4">
          {products.map((p) => (
            <ProductCard
              key={p._id}
              product={p}
              onAddToCart={() => addItem(p)}
              onToggleWishlist={() => handleToggleWishlist(p._id)}
              isWishlisted={wishlistIds.includes(p._id)}
            />
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
