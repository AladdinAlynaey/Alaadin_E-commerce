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
import styles from './page.module.css';

export default function HomePage() {
  const t = useTranslations('home');
  const tc = useTranslations('common');
  const locale = useLocale();
  const { formatPrice } = useCurrency();
  const { addItem } = useCart();
  const { token } = useAuth();
  
  const [featured, setFeatured] = useState<any[]>([]);
  const [flashDeals, setFlashDeals] = useState<any[]>([]);
  const [bestSelling, setBestSelling] = useState<any[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    api.get<any[]>('/products/featured?limit=8').then(setFeatured).catch(() => {});
    api.get<any[]>('/products/flash-deals?limit=4').then(setFlashDeals).catch(() => {});
    api.get<any[]>('/products/best-selling?limit=8').then(setBestSelling).catch(() => {});
    api.get<any[]>('/categories/tree-flat').then(setCategories).catch(() => {});
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

  const name = (item: any) => item?.name?.[locale] || item?.name?.en || '';

  const matchCategory = (productCategory: any, filterId: string): boolean => {
    if (filterId === 'all') return true;
    if (!productCategory) return false;
    const catId = typeof productCategory === 'string' ? productCategory : (productCategory._id || productCategory.key);
    if (String(catId).toLowerCase() === filterId.toLowerCase()) return true;

    let current = categories.find(c => String(c._id) === String(catId));
    while (current) {
      const pId = current.parent?._id || current.parent;
      if (!pId) break;
      if (String(pId).toLowerCase() === filterId.toLowerCase()) return true;
      current = categories.find(c => String(c._id) === String(pId));
    }
    return false;
  };

  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroOverlay} />
          <div className={`container ${styles.heroContent}`}>
            <span className={styles.heroBadge}>✨ {tc('newArrivals')}</span>
            <h1 className={styles.heroTitle}>{t('heroTitle')}</h1>
            <p className={styles.heroSubtitle}>{t('heroSubtitle')}</p>
            <div className={styles.heroCta}>
              <a href={`/${locale}/products`} className="btn btn-primary btn-lg">{t('shopNow')}</a>
              <a href={`/${locale}/products?featured=true`} className="btn btn-secondary btn-lg">{tc('viewAll')}</a>
            </div>
            <div className={styles.heroStats}>
              <div className={styles.stat}><span className={styles.statNum}>500+</span><span className={styles.statLabel}>{tc('products')}</span></div>
              <div className={styles.stat}><span className={styles.statNum}>50+</span><span className={styles.statLabel}>{locale === 'ar' ? 'علامة تجارية' : 'Brands'}</span></div>
              <div className={styles.stat}><span className={styles.statNum}>10K+</span><span className={styles.statLabel}>{locale === 'ar' ? 'عميل سعيد' : 'Happy Customers'}</span></div>
            </div>
          </div>
        </section>

        {/* Categories Quick Nav */}
        <section className={`section container`}>
          <h2 className="section-title">{t('categoriesTitle')}</h2>
          <div className={styles.categories}>
            {categories.filter(c => !c.parent || c.depth === 0).map(cat => {
              const nameLower = (cat.name?.en || '').toLowerCase();
              let icon = '📦';
              if (nameLower.includes('men')) icon = '👔';
              else if (nameLower.includes('women')) icon = '👗';
              else if (nameLower.includes('kid') || nameLower.includes('boy') || nameLower.includes('girl')) icon = '🧒';
              else if (nameLower.includes('shoe') || nameLower.includes('footwear')) icon = '👟';
              else if (nameLower.includes('bag') || nameLower.includes('accessory')) icon = '👜';

              return (
                <a key={cat._id} href={`/${locale}/products?category=${cat._id}`} className={styles.categoryCard}>
                  <span className={styles.categoryIcon}>{icon}</span>
                  <span className={styles.categoryLabel}>{cat.name?.[locale]}</span>
                </a>
              );
            })}
            {categories.filter(c => !c.parent || c.depth === 0).length === 0 && [
              { key: 'men', icon: '👔', label: tc('men') },
              { key: 'women', icon: '👗', label: tc('women') },
              { key: 'kids', icon: '🧒', label: tc('kids') },
            ].map(cat => (
              <a key={cat.key} href={`/${locale}/products?category=${cat.key}`} className={styles.categoryCard}>
                <span className={styles.categoryIcon}>{cat.icon}</span>
                <span className={styles.categoryLabel}>{cat.label}</span>
              </a>
            ))}
          </div>
        </section>

        {/* Featured Products */}
        <section className={`section container`}>
          <div className="flex-between">
            <h2 className="section-title">{tc('featured')}</h2>
            <a href={`/${locale}/products?featured=true`} className="btn btn-ghost btn-sm">{tc('viewAll')} →</a>
          </div>

          {/* Dynamic Category Filter Bar (APK layout style) */}
          <div className={styles.filterBar}>
            <button 
              className={`${styles.filterTab} ${selectedFilter === 'all' ? styles.filterTabActive : ''}`}
              onClick={() => setSelectedFilter('all')}
            >
              {locale === 'ar' ? 'الكل' : 'All'}
            </button>
            {categories.filter(c => !c.parent || c.depth === 0).map(tab => (
              <button 
                key={tab._id} 
                className={`${styles.filterTab} ${selectedFilter === tab._id ? styles.filterTabActive : ''}`}
                onClick={() => setSelectedFilter(tab._id)}
              >
                {tab.name?.[locale]}
              </button>
            ))}
          </div>

          <div className="grid grid-4">
            {(featured.length > 0 ? featured : Array.from({length: 8}, (_, i) => {
              const demoCats = ['men', 'women', 'kids', 'new'];
              const cat = demoCats[i % demoCats.length];
              return {
                _id: `demo-${i}`,
                name: { 
                  ar: `${i % 2 === 0 ? '👔' : '👗'} منتج ${i+1}`, 
                  en: `Product ${i+1} (${cat.toUpperCase()})` 
                },
                price: { YER: (i+1)*5000, SAR: (i+1)*50, USD: (i+1)*15 },
                images: [], 
                ratings: { average: 4.5, count: 12 },
                category: cat,
              };
            })).filter((product: any) => matchCategory(product.category, selectedFilter))
            .map((product: any) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={() => addItem(product)}
                onToggleWishlist={() => handleToggleWishlist(product._id)}
                isWishlisted={wishlistIds.includes(product._id)}
              />
            ))}
          </div>
        </section>

        {/* Flash Deals */}
        <section className={styles.flashSection}>
          <div className="container">
            <div className="flex-between">
              <div>
                <h2 className={styles.flashTitle}>🔥 {t('flashDealsTitle')}</h2>
                <p className={styles.flashSubtitle}>{t('flashDealsSubtitle')}</p>
              </div>
              <a href={`/${locale}/products?flashDeal=true`} className="btn btn-ghost btn-sm">{tc('viewAll')}</a>
            </div>
            <div className={`grid grid-4 ${styles.flashGrid}`}>
              {(flashDeals.length > 0 ? flashDeals : Array.from({length: 4}, (_, i) => ({
                _id: `flash-${i}`, name: { ar: `عرض خاطف ${i+1}`, en: `Flash Deal ${i+1}` },
                price: { YER: (i+1)*3000, SAR: (i+1)*30, USD: (i+1)*10 },
                compareAtPrice: { YER: (i+1)*5000, SAR: (i+1)*50, USD: (i+1)*15 },
                images: [], ratings: { average: 4.2, count: 8 },
                isFlashDeal: true,
              }))).map((product: any) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onAddToCart={() => addItem(product._id)}
                  onToggleWishlist={() => handleToggleWishlist(product._id)}
                  isWishlisted={wishlistIds.includes(product._id)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Best Selling */}
        <section className={`section container`}>
          <div className="flex-between">
            <h2 className="section-title">{tc('bestSelling')}</h2>
            <a href={`/${locale}/products?sortBy=bestSelling`} className="btn btn-ghost btn-sm">{tc('viewAll')} →</a>
          </div>
          <div className="grid grid-4">
            {(bestSelling.length > 0 ? bestSelling : Array.from({length: 4}, (_, i) => ({
              _id: `best-${i}`, name: { ar: `الأكثر مبيعاً ${i+1}`, en: `Best Seller ${i+1}` },
              price: { YER: (i+1)*4500, SAR: (i+1)*45, USD: (i+1)*12 },
              images: [], ratings: { average: 4.8, count: 25 }, soldCount: 100-i*20,
            }))).map((product: any) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={() => addItem(product._id)}
                onToggleWishlist={() => handleToggleWishlist(product._id)}
                isWishlisted={wishlistIds.includes(product._id)}
              />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
