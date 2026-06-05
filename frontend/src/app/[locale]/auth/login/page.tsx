'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Header from '@/components/layout/Header';
import styles from './auth.module.css';

export default function LoginPage() {
  const t = useTranslations('auth');
  const locale = useLocale();
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      router.push(`/${locale}`);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className={styles.authPage}>
        <div className={styles.authCard}>
          <div className={styles.authHeader}>
            <span className={styles.authIcon}>✦</span>
            <h1 className={styles.authTitle}>{t('loginTitle')}</h1>
          </div>
          <form onSubmit={handleSubmit} className={styles.authForm}>
            {error && <div className={styles.error}>{error}</div>}
            <div className="input-group">
              <label>{t('email')}</label>
              <input type="email" className="input" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="input-group">
              <label>{t('password')}</label>
              <input type="password" className="input" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
              {loading ? '...' : t('loginButton')}
            </button>
          </form>
          <p className={styles.authSwitch}>
            {t('noAccount')} <a href={`/${locale}/auth/register`}>{t('registerButton')}</a>
          </p>
        </div>
      </main>
    </>
  );
}
