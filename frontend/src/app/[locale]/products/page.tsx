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
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Load Categories & query category from URL
  useEffect(() => {
    api.get<any[]>('/categories/tree-flat')
      .then(setCategories)
      .catch(() => {
        api.get<any[]>('/categories').then(setCategories).catch(() => {});
      });

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get('category');
      if (cat) setSelectedCategory(cat);
    }
  }, []);

  // Fetch products matching category parameter
  useEffect(() => {
    const categoryQuery = selectedCategory !== 'all' ? `&category=${selectedCategory}` : '';
    api.get<any>(`/products?limit=20${categoryQuery}`)
      .then(res => setProducts(res.data || []))
      .catch(() => {
        setProducts(Array.from({ length: 8 }, (_, i) => ({
          _id: `p-${i}`, name: { ar: `منتج ${i+1}`, en: `Product ${i+1}` },
          price: { YER: (i+1)*3500, SAR: (i+1)*35, USD: (i+1)*10 },
          images: [], ratings: { average: 4, count: 5+i*3 },
        })));
      });
  }, [selectedCategory]);

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

  const isAr = locale === 'ar';

  return (
    <>
      <Header />
      <main className="container section page-enter">
        {/* Dynamic Catalog Filter Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, gap: 16, flexWrap: 'wrap' }}>
          <h1 className="section-title" style={{ margin: 0 }}>{tc('products')}</h1>
          
          <div className="input-group" style={{ width: '100%', maxWidth: '300px', margin: 0 }}>
            <select 
              className="input" 
              value={selectedCategory} 
              onChange={e => {
                const newCat = e.target.value;
                setSelectedCategory(newCat);
                if (typeof window !== 'undefined') {
                  const url = new URL(window.location.href);
                  if (newCat === 'all') {
                    url.searchParams.delete('category');
                  } else {
                    url.searchParams.set('category', newCat);
                  }
                  window.history.pushState({}, '', url.toString());
                }
              }}
            >
              <option value="all">{isAr ? 'جميع التصنيفات' : 'All Categories'}</option>
              {categories.map(c => (
                <option key={c._id} value={c._id}>
                  {'\u00A0'.repeat((c.depth || 0) * 4)}{c.depth > 0 ? '↳ ' : ''}{c.name?.[locale]}
                </option>
              ))}
            </select>
          </div>
        </div>

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
          {products.length === 0 && (
            <div style={{ gridColumn: '1 / -1', padding: '60px 24px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
              {isAr ? 'لا توجد منتجات مطابقة في هذا التصنيف' : 'No products found in this category'}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
