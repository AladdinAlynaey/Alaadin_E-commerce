'use client';

import { useLocale } from 'next-intl';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './admin.module.css';

const menuItems = [
  { key: 'admin', icon: '📊', labelAr: 'لوحة التحكم', labelEn: 'Dashboard' },
  { key: 'admin/orders', icon: '🛒', labelAr: 'الطلبات', labelEn: 'Orders' },
  { key: 'admin/products', icon: '📦', labelAr: 'المنتجات', labelEn: 'Products' },
  { key: 'admin/users', icon: '👥', labelAr: 'المستخدمون', labelEn: 'Users' },
  { key: 'admin/categories', icon: '📁', labelAr: 'التصنيفات', labelEn: 'Categories' },
  { key: 'admin/coupons', icon: '🎟️', labelAr: 'الكوبونات', labelEn: 'Coupons' },
  { key: 'admin/currency', icon: '💱', labelAr: 'العملات', labelEn: 'Currency' },
  { key: 'admin/shipping', icon: '🚚', labelAr: 'الشحن', labelEn: 'Shipping' },
  { key: 'admin/reviews', icon: '⭐', labelAr: 'التقييمات', labelEn: 'Reviews' },
  { key: 'admin/settings', icon: '⚙️', labelAr: 'الإعدادات', labelEn: 'Settings' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const locale = useLocale();
  const { isAdmin, user, isLoading } = useAuth();
  const { toggleTheme, resolvedTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAdmin && user) router.push(`/${locale}`);
  }, [isAdmin, user, isLoading]);

  const isActive = (key: string) => {
    const path = `/${locale}/${key}`;
    return pathname === path || (key !== 'admin' && pathname.startsWith(path));
  };

  const switchLocale = () => {
    const newLocale = locale === 'ar' ? 'en' : 'ar';
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className={styles.layout}>
      {/* Mobile-only Admin Header */}
      <div className={styles.adminHeader}>
        <button className={styles.adminMenuBtn} onClick={() => setMobileSidebarOpen(true)} aria-label="Open menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
        <span className={styles.adminHeaderTitle}>
          {locale === 'ar' ? 'لوحة التحكم' : 'Admin Panel'}
        </span>
      </div>

      {/* Backdrop overlay for mobile drawer */}
      <div className={`${styles.adminOverlay} ${mobileSidebarOpen ? styles.adminOverlayActive : ''}`} onClick={() => setMobileSidebarOpen(false)} />

      <aside className={`${styles.sidebar} ${mobileSidebarOpen ? styles.sidebarOpen : ''}`}>
        {/* Close Button inside drawer (mobile only) */}
        <button className={styles.sidebarCloseBtn} onClick={() => setMobileSidebarOpen(false)} aria-label="Close menu">✕</button>

        <a href={`/${locale}`} className={styles.brand} onClick={() => setMobileSidebarOpen(false)}>
          <span className={styles.brandIcon}>✦</span>
          <span className={styles.brandText}>Admin</span>
        </a>
        <nav className={styles.nav}>
          {menuItems.map(item => (
            <a key={item.key} href={`/${locale}/${item.key}`}
              className={`${styles.navItem} ${isActive(item.key) ? styles.navItemActive : ''}`}
              onClick={() => setMobileSidebarOpen(false)}>
              <span>{item.icon}</span>
              <span>{locale === 'ar' ? item.labelAr : item.labelEn}</span>
            </a>
          ))}
        </nav>
        <div className={styles.sidebarFooter}>
          <div className={styles.controls}>
            {/* Theme Toggle Button */}
            <button className={styles.controlBtn} onClick={toggleTheme} aria-label="Toggle theme">
              {resolvedTheme === 'dark' ? '☀️ Light' : '🌙 Dark'}
            </button>
            {/* Language Switcher Button */}
            <button className={styles.controlBtn} onClick={switchLocale}>
              {locale === 'ar' ? 'English' : 'عربي'}
            </button>
          </div>
          <a href={`/${locale}`} className={`btn btn-ghost btn-sm ${styles.backBtn}`}>← {locale === 'ar' ? 'المتجر' : 'Store'}</a>
        </div>
      </aside>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
