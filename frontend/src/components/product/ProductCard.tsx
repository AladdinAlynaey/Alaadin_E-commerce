'use client';

import { useCurrency } from '@/contexts/CurrencyContext';
import { useLocale } from 'next-intl';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: any;
  onAddToCart?: () => void;
  onToggleWishlist?: () => void;
  isWishlisted?: boolean;
}

export default function ProductCard({ product, onAddToCart, onToggleWishlist, isWishlisted }: ProductCardProps) {
  const locale = useLocale();
  const { formatPrice } = useCurrency();
  const name = product.name?.[locale] || product.name?.en || '';
  const rating = Math.round(product.ratings?.average || 0);

  return (
    <div className={styles.card}>
      <a href={`/${locale}/products/${product._id}`} className={styles.imageWrap}>
        <div className={styles.imagePlaceholder}>
          {product.images?.[0] ? (
            <img src={product.images[0]} alt={name} className={styles.image} />
          ) : (
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
          )}
        </div>
        {product.isFlashDeal && <span className={styles.dealBadge}>{locale === 'ar' ? 'عرض' : 'Sale'}</span>}
        {product.isNew && <span className={styles.newBadge}>{locale === 'ar' ? 'جديد' : 'New'}</span>}
      </a>
      <div className={styles.actions}>
        <button className={`${styles.wishBtn} ${isWishlisted ? styles.wishlisted : ''}`} onClick={onToggleWishlist}>
          {isWishlisted ? '❤️' : '♡'}
        </button>
      </div>
      <div className={styles.info}>
        <h3 className={styles.name}>{name}</h3>
        <div className={styles.ratingRow}>
          <span className="stars">{'★'.repeat(rating)}{'☆'.repeat(5-rating)}</span>
          <span className={styles.count}>({product.ratings?.count || 0})</span>
        </div>
        <div className={styles.priceRow}>
          <span className={styles.price}>{formatPrice(product.price)}</span>
          {product.compareAtPrice && <span className={styles.oldPrice}>{formatPrice(product.compareAtPrice)}</span>}
        </div>
        {onAddToCart && (
          <button className={`btn btn-primary btn-sm btn-full ${styles.cartBtn}`} onClick={onAddToCart}>
            {locale === 'ar' ? 'أضف إلى السلة' : 'Add to Cart'}
          </button>
        )}
      </div>
    </div>
  );
}
