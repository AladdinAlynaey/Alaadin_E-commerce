'use client';

import { useTranslations, useLocale } from 'next-intl';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import { useEffect, useState } from 'react';
import { useCurrency } from '@/contexts/CurrencyContext';

export default function WishlistPage() {
  const t = useTranslations('common');
  const locale = useLocale();
  const { token } = useAuth();
  const { formatPrice } = useCurrency();
  const [wishlist, setWishlist] = useState<any[]>([]);

  useEffect(() => {
    if (token) {
      api.get<any>('/wishlist', token).then(w => setWishlist(w.products || [])).catch(() => {});
    }
  }, [token]);

  return (
    <>
      <Header />
      <main className="container section page-enter">
        <h1 className="section-title">{t('wishlist')}</h1>
        {wishlist.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 0', color: 'var(--text-secondary)' }}>
            <p style={{ fontSize: '48px', marginBottom: '16px' }}>♡</p>
            <p>{locale === 'ar' ? 'قائمة المفضلة فارغة' : 'Your wishlist is empty'}</p>
          </div>
        ) : (
          <div className="grid grid-4">
            {wishlist.map((p: any) => (
              <div key={p._id} className="card">
                <div style={{ aspectRatio: '3/4', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
                </div>
                <div style={{ padding: '16px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 600 }}>{p.name?.[locale]}</h3>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--primary)', margin: '8px 0' }}>{formatPrice(p.price)}</div>
                  <button className="btn btn-primary btn-sm btn-full">{t('addToCart')}</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
