'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Header from '@/components/layout/Header';
import styles from '../login/auth.module.css';

export default function RegisterPage() {
  const t = useTranslations('auth');
  const locale = useLocale();
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '', nameAr: '', nameEn: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
    setLoading(true);
    try {
      await register({ email: form.email, password: form.password, name: { ar: form.nameAr, en: form.nameEn }, phone: form.phone });
      router.push(`/${locale}`);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <>
      <Header />
      <main className={styles.authPage}>
        <div className={styles.authCard}>
          <div className={styles.authHeader}>
            <span className={styles.authIcon}>✦</span>
            <h1 className={styles.authTitle}>{t('registerTitle')}</h1>
          </div>
          <form onSubmit={handleSubmit} className={styles.authForm}>
            {error && <div className={styles.error}>{error}</div>}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="input-group"><label>{t('nameAr')}</label><input className="input" value={form.nameAr} onChange={e => update('nameAr', e.target.value)} required /></div>
              <div className="input-group"><label>{t('nameEn')}</label><input className="input" value={form.nameEn} onChange={e => update('nameEn', e.target.value)} required /></div>
            </div>
            <div className="input-group"><label>{t('email')}</label><input type="email" className="input" value={form.email} onChange={e => update('email', e.target.value)} required /></div>
            <div className="input-group"><label>{t('phone')}</label><input type="tel" className="input" value={form.phone} onChange={e => update('phone', e.target.value)} /></div>
            <div className="input-group"><label>{t('password')}</label><input type="password" className="input" value={form.password} onChange={e => update('password', e.target.value)} required /></div>
            <div className="input-group"><label>{t('confirmPassword')}</label><input type="password" className="input" value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} required /></div>
            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>{loading ? '...' : t('registerButton')}</button>
          </form>
          <p className={styles.authSwitch}>{t('hasAccount')} <a href={`/${locale}/auth/login`}>{t('loginButton')}</a></p>
        </div>
      </main>
    </>
  );
}
