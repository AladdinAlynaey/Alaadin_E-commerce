'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useState } from 'react';
import styles from './Header.module.css';

export default function Header() {
  const t = useTranslations('common');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();
  const { toggleTheme, resolvedTheme } = useTheme();
  const { currency, currencies, setCurrency } = useCurrency();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const switchLocale = () => {
    const newLocale = locale === 'ar' ? 'en' : 'ar';
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <>
      <header className={styles.header}>
        <div className={`container ${styles.headerInner}`}>
          {/* Logo */}
          <a href={`/${locale}`} className={styles.logo}>
            <span className={styles.logoIcon}>✦</span>
            <span className={styles.logoText}>{t('appName')}</span>
          </a>

          {/* Navigation */}
          <nav className={`${styles.nav} ${mobileMenuOpen ? styles.navOpen : ''}`}>
            <a href={`/${locale}`} className={styles.navLink} onClick={() => setMobileMenuOpen(false)}>{t('home')}</a>
            <a href={`/${locale}/products`} className={styles.navLink} onClick={() => setMobileMenuOpen(false)}>{t('products')}</a>
            <a href={`/${locale}/products?category=men`} className={styles.navLink} onClick={() => setMobileMenuOpen(false)}>{t('men')}</a>
            <a href={`/${locale}/products?category=women`} className={styles.navLink} onClick={() => setMobileMenuOpen(false)}>{t('women')}</a>
            <a href={`/${locale}/products?category=kids`} className={styles.navLink} onClick={() => setMobileMenuOpen(false)}>{t('kids')}</a>

            <div className={styles.mobileDivider} />

            {/* Mobile Search */}
            <a href={`/${locale}/search`} className={styles.mobileMenuLink} onClick={() => setMobileMenuOpen(false)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <span>{locale === 'ar' ? 'البحث' : 'Search'}</span>
            </a>

            {/* Mobile Wishlist */}
            <a href={`/${locale}/wishlist`} className={styles.mobileMenuLink} onClick={() => setMobileMenuOpen(false)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              <span>{locale === 'ar' ? 'المفضلة' : 'Wishlist'}</span>
            </a>

            {/* Mobile Theme Toggle */}
            <button className={styles.mobileMenuLink} onClick={toggleTheme}>
              {resolvedTheme === 'dark' ? (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
                  <span>{locale === 'ar' ? 'وضع النهار' : 'Light Mode'}</span>
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                  <span>{locale === 'ar' ? 'الوضع الداكن' : 'Dark Mode'}</span>
                </>
              )}
            </button>

            {/* Mobile Language */}
            <button className={styles.mobileMenuLink} onClick={switchLocale}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              <span>{locale === 'ar' ? 'English' : 'العربية'}</span>
            </button>

            {/* Mobile Currency */}
            <div className={styles.mobileCurrencyItem}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              <span className={styles.mobileCurrencyLabel}>{locale === 'ar' ? 'العملة:' : 'Currency:'}</span>
              <select className={styles.mobileCurrencySelect} value={currency} onChange={(e) => setCurrency(e.target.value)}>
                {currencies.map(c => (
                  <option key={c.code} value={c.code}>{c.symbol} {c.code}</option>
                ))}
              </select>
            </div>

            <div className={styles.mobileDivider} />

            {/* Mobile Account / Login */}
            {user ? (
              <>
                <a href={`/${locale}/account`} className={styles.mobileMenuLink} onClick={() => setMobileMenuOpen(false)}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  <span>{t('account')}</span>
                </a>
                {isAdmin && (
                  <a href={`/${locale}/admin`} className={styles.mobileMenuLink} onClick={() => setMobileMenuOpen(false)}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 17V7h6v10"/></svg>
                    <span>Admin Panel</span>
                  </a>
                )}
                <button 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }} 
                  className={styles.mobileMenuLink}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>
                  <span>{t('logout')}</span>
                </button>
              </>
            ) : (
              <button 
                className={`btn btn-primary btn-full`} 
                onClick={() => {
                  setMobileMenuOpen(false);
                  router.push(`/${locale}/auth/login`);
                }}
                style={{ marginTop: '8px' }}
              >
                {t('login')}
              </button>
            )}
          </nav>

          {/* Actions */}
          <div className={styles.actions}>
            {/* Search */}
            <button className={`btn-icon ${styles.actionBtn}`} onClick={() => router.push(`/${locale}/search`)} aria-label="Search">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </button>

            {/* Theme Toggle */}
            <button className={`btn-icon ${styles.actionBtn}`} onClick={toggleTheme} aria-label="Toggle theme">
              {resolvedTheme === 'dark' ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              )}
            </button>

            {/* Language */}
            <button className={`btn-sm ${styles.langBtn}`} onClick={switchLocale}>
              {locale === 'ar' ? 'EN' : 'عربي'}
            </button>

            {/* Currency */}
            <select className={styles.currencySelect} value={currency} onChange={(e) => setCurrency(e.target.value)}>
              {currencies.map(c => (
                <option key={c.code} value={c.code}>{c.symbol} {c.code}</option>
              ))}
            </select>

            {/* Wishlist */}
            <button className={`btn-icon ${styles.actionBtn}`} onClick={() => router.push(`/${locale}/wishlist`)} aria-label="Wishlist">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            </button>

            {/* Cart */}
            <button className={`btn-icon ${styles.actionBtn} ${styles.cartBtn}`} onClick={() => router.push(`/${locale}/cart`)} aria-label="Cart">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              {itemCount > 0 && <span className={styles.cartBadge}>{itemCount}</span>}
            </button>

            {/* Account */}
            {user ? (
              <div className={styles.userMenu}>
                <button className={`btn-icon ${styles.actionBtn}`} aria-label="Account">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </button>
                <div className={styles.dropdown}>
                  <a href={`/${locale}/account`} className={styles.dropdownItem}>{t('account')}</a>
                  {isAdmin && <a href={`/${locale}/admin`} className={styles.dropdownItem}>Admin</a>}
                  <button onClick={logout} className={styles.dropdownItem}>{t('logout')}</button>
                </div>
              </div>
            ) : (
              <button className={`btn btn-primary btn-sm`} onClick={() => router.push(`/${locale}/auth/login`)}>
                {t('login')}
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button className={`btn-icon ${styles.menuToggle}`} onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Menu">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {mobileMenuOpen ? <path d="M18 6 6 18M6 6l12 12"/> : <path d="M3 12h18M3 6h18M3 18h18"/>}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Sticky Bottom Navigation for Mobile (App-like UX) */}
      <div className={styles.bottomNav}>
        {/* Home */}
        <a 
          href={`/${locale}`} 
          className={`${styles.bottomNavItem} ${pathname === `/${locale}` || pathname === '/' ? styles.bottomNavItemActive : ''}`}
        >
          <div className={styles.bottomNavItemIcon}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </div>
          <span>{locale === 'ar' ? 'الرئيسية' : 'Home'}</span>
        </a>

        {/* Search */}
        <a 
          href={`/${locale}/search`} 
          className={`${styles.bottomNavItem} ${pathname.includes('/search') ? styles.bottomNavItemActive : ''}`}
        >
          <div className={styles.bottomNavItemIcon}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </div>
          <span>{locale === 'ar' ? 'البحث' : 'Search'}</span>
        </a>

        {/* Cart */}
        <a 
          href={`/${locale}/cart`} 
          className={`${styles.bottomNavItem} ${pathname.includes('/cart') ? styles.bottomNavItemActive : ''}`}
        >
          <div className={styles.bottomNavItemIcon}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            {itemCount > 0 && <span className={styles.bottomNavBadge}>{itemCount}</span>}
          </div>
          <span>{locale === 'ar' ? 'السلة' : 'Cart'}</span>
        </a>

        {/* Wishlist */}
        <a 
          href={`/${locale}/wishlist`} 
          className={`${styles.bottomNavItem} ${pathname.includes('/wishlist') ? styles.bottomNavItemActive : ''}`}
        >
          <div className={styles.bottomNavItemIcon}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </div>
          <span>{locale === 'ar' ? 'المفضلة' : 'Wishlist'}</span>
        </a>

        {/* Menu (Drawer Toggle) */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
          className={`${styles.bottomNavItem} ${mobileMenuOpen ? styles.bottomNavItemActive : ''}`}
        >
          <div className={styles.bottomNavItemIcon}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {mobileMenuOpen ? <line x1="18" y1="6" x2="6" y2="18"></line> : <line x1="3" y1="12" x2="21" y2="12"></line>}
              {mobileMenuOpen ? <line x1="6" y1="6" x2="18" y2="18"></line> : <line x1="3" y1="6" x2="21" y2="6"></line>}
              {!mobileMenuOpen && <line x1="3" y1="18" x2="21" y2="18"></line>}
            </svg>
          </div>
          <span>{locale === 'ar' ? 'المزيد' : 'Menu'}</span>
        </button>
      </div>
    </>
  );
}
