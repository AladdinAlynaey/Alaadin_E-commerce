'use client';

import { useTranslations, useLocale } from 'next-intl';
import styles from './Footer.module.css';

export default function Footer() {
  const t = useTranslations('footer');
  const tc = useTranslations('common');
  const locale = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerInner}`}>
        <div className={styles.grid}>
          {/* Brand */}
          <div className={styles.brand}>
            <div className={styles.logo}>
              <span className={styles.logoIcon}>✦</span>
              <span>{tc('appName')}</span>
            </div>
            <p className={styles.brandDesc}>
              {locale === 'ar'
                ? 'وجهتك الأولى لأحدث صيحات الموضة والأزياء العصرية بأفضل الأسعار'
                : 'Your destination for the latest fashion trends at the best prices'}
            </p>
            <div className={styles.social}>
              {['instagram', 'twitter', 'facebook'].map(s => (
                <a key={s} href="#" className={styles.socialLink} aria-label={s}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>{locale === 'ar' ? 'روابط سريعة' : 'Quick Links'}</h4>
            <a href={`/${locale}/products`} className={styles.link}>{tc('products')}</a>
            <a href={`/${locale}/products?featured=true`} className={styles.link}>{tc('newArrivals')}</a>
            <a href={`/${locale}/products?flashDeal=true`} className={styles.link}>{tc('flashDeals')}</a>
          </div>

          {/* Support */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>{locale === 'ar' ? 'الدعم' : 'Support'}</h4>
            <a href="#" className={styles.link}>{t('contactUs')}</a>
            <a href="#" className={styles.link}>{t('faq')}</a>
            <a href="#" className={styles.link}>{t('returnPolicy')}</a>
          </div>

          {/* Newsletter */}
          <div className={styles.col}>
            <h4 className={styles.colTitle}>{t('newsletter')}</h4>
            <p className={styles.newsDesc}>{t('subscribeText')}</p>
            <div className={styles.newsForm}>
              <input type="email" placeholder={locale === 'ar' ? 'بريدك الإلكتروني' : 'Your email'} className={`input ${styles.newsInput}`} />
              <button className="btn btn-primary btn-sm">{t('subscribe')}</button>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>© {year} {tc('appName')}. {t('copyright')}</p>
          <div className={styles.bottomLinks}>
            <a href="#">{t('privacyPolicy')}</a>
            <a href="#">{t('termsOfService')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
