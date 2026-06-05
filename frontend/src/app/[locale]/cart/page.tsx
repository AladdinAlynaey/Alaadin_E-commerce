'use client';

import { useTranslations, useLocale } from 'next-intl';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useCart } from '@/contexts/CartContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import styles from './Cart.module.css';

export default function CartPage() {
  const t = useTranslations('cart');
  const tc = useTranslations('common');
  const locale = useLocale();
  const { items, removeItem, updateQuantity, itemCount } = useCart();
  const { formatPrice } = useCurrency();

  const name = (item: any) => item?.product?.name?.[locale] || item?.product?.name?.en || 'Product';

  const total = items.reduce((acc, item) => acc + (item.product?.price || 0) * item.quantity, 0);

  return (
    <>
      <Header />
      <main className="container section page-enter">
        <h1 className="section-title">{t('title')}</h1>
        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 0' }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="1.5" style={{ margin: '0 auto 16px' }}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>{t('empty')}</p>
            <a href={`/${locale}/products`} className="btn btn-primary">{t('continueShopping')}</a>
          </div>
        ) : (
          <div className={styles.cartLayout}>
            <div className={styles.itemsList}>
              {items.map((item, index) => (
                <div key={index} className={styles.cartItem}>
                  <div className={styles.imgWrap}>
                    {item.product?.images?.[0] ? (
                      <img src={item.product.images[0]} alt={name(item)} className={styles.img} />
                    ) : (
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
                    )}
                  </div>
                  <div className={styles.itemDetails}>
                    <h3 className={styles.itemTitle}>{name(item)}</h3>
                    <div className={styles.badges}>
                      {item.variant?.size && <span className="badge badge-primary">{item.variant.size}</span>}
                      {item.variant?.color && <span className="badge badge-primary">{item.variant.color}</span>}
                    </div>
                  </div>
                  <div className={styles.actionRow}>
                    <div className={styles.quantityControls}>
                      <button className={styles.qtyBtn} onClick={() => updateQuantity(index, item.quantity - 1)}>−</button>
                      <span className={styles.qtyVal}>{item.quantity}</span>
                      <button className={styles.qtyBtn} onClick={() => updateQuantity(index, item.quantity + 1)}>+</button>
                    </div>
                    <div className={styles.price}>
                      {formatPrice((item.product?.price || 0) * item.quantity)}
                    </div>
                  </div>
                  <button className={styles.deleteBtn} onClick={() => removeItem(index)} aria-label={locale === 'ar' ? 'حذف' : 'Remove'}>✕</button>
                </div>
              ))}
            </div>
            <div className={styles.summaryCard}>
              <h3 className={styles.summaryTitle}>{t('title')}</h3>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>{t('subtotal')}</span>
                <span className={styles.summaryValue}>{itemCount} {locale === 'ar' ? 'منتج' : 'items'}</span>
              </div>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>{t('shipping')}</span>
                <span className={styles.summaryValue}>{locale === 'ar' ? 'يحسب لاحقاً' : 'Calculated at checkout'}</span>
              </div>
              <div className={styles.summaryDivider}>
                <span className={styles.totalLabel}>{t('total')}</span>
                <span className={styles.totalValue}>{formatPrice(total)}</span>
              </div>
              <a href={`/${locale}/checkout`} className={`btn btn-primary btn-full btn-lg ${styles.checkoutBtn}`}>{t('checkout')}</a>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
