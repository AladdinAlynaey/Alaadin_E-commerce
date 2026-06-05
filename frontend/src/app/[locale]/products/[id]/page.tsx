'use client';

import { useLocale } from 'next-intl';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useCart } from '@/contexts/CartContext';
import { useEffect, useState, use } from 'react';
import api from '@/lib/api';
import styles from './ProductDetail.module.css';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const locale = useLocale();
  const { formatPrice } = useCurrency();
  const { addItem } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  useEffect(() => {
    api.get<any>(`/products/${id}`).then(setProduct).catch(() => {
      setProduct({ _id: id, name: { ar: 'منتج تجريبي', en: 'Demo Product' },
        description: { ar: 'وصف المنتج', en: 'Product description' },
        price: { YER: 15000, SAR: 150, USD: 40 }, images: [],
        variants: [{ size: 'M', color: { name: { ar: 'أسود', en: 'Black' }, hex: '#000' }, stock: 10 }],
        ratings: { average: 4.5, count: 23 } });
    });
  }, [id]);

  if (!product) return <><Header /><main className="container section"><div className="skeleton" style={{ height: 400 }} /></main></>;

  const n = product.name?.[locale] || product.name?.en;
  const sizes = [...new Set(product.variants?.map((v: any) => v.size).filter(Boolean))];
  const colors = product.variants?.filter((v: any) => v.color?.hex).reduce((acc: any[], v: any) => {
    if (!acc.find((c: any) => c.hex === v.color.hex)) acc.push(v.color);
    return acc;
  }, []) || [];

  return (
    <>
      <Header />
      <main className="container section page-enter">
        <div className={styles.grid}>
          <div className={styles.imageWrap}>
            {product.images?.[0] ? (
              <img src={product.images[0]} alt={n} className={styles.image} />
            ) : (
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
            )}
          </div>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '16px' }}>{n}</h1>
            <div className="stars" style={{ fontSize: '20px', marginBottom: '16px' }}>{'★'.repeat(Math.round(product.ratings?.average))} <span style={{ fontSize: '14px', color: 'var(--text-tertiary)' }}>({product.ratings?.count})</span></div>
            <div style={{ fontSize: '32px', fontWeight: 800, color: 'var(--primary)', marginBottom: '24px' }}>{formatPrice(product.price)}</div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '32px' }}>{product.description?.[locale]}</p>
            {sizes.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '14px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>{locale === 'ar' ? 'المقاس' : 'Size'}</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {(sizes as string[]).map(s => (
                    <button key={s} className={`btn btn-sm ${selectedSize === s ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setSelectedSize(s)}>{s}</button>
                  ))}
                </div>
              </div>
            )}
            {colors.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <label style={{ fontSize: '14px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>{locale === 'ar' ? 'اللون' : 'Color'}</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {colors.map((c: any) => (
                    <button key={c.hex} onClick={() => setSelectedColor(c.hex)} style={{ width: 36, height: 36, borderRadius: '50%', background: c.hex, border: selectedColor === c.hex ? '3px solid var(--primary)' : '2px solid var(--border)', cursor: 'pointer' }} />
                  ))}
                </div>
              </div>
            )}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn btn-primary btn-lg" style={{ flex: 1 }} onClick={() => addItem(product, { size: selectedSize, color: selectedColor })}>
                {locale === 'ar' ? 'أضف إلى السلة' : 'Add to Cart'}
              </button>
              <button className="btn btn-secondary btn-lg btn-icon" style={{ fontSize: '20px' }}>♡</button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
