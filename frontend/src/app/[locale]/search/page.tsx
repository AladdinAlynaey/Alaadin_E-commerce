'use client';

import { useTranslations, useLocale } from 'next-intl';
import Header from '@/components/layout/Header';
import { useState } from 'react';
import api from '@/lib/api';
import { useCurrency } from '@/contexts/CurrencyContext';

export default function SearchPage() {
  const t = useTranslations('search');
  const locale = useLocale();
  const { formatPrice } = useCurrency();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);

  const handleSearch = async (q: string) => {
    setQuery(q);
    if (q.length < 2) { setResults([]); return; }
    try {
      const data = await api.get<any[]>(`/products/search?q=${encodeURIComponent(q)}&limit=20`);
      setResults(data);
    } catch { setResults([]); }
  };

  return (
    <>
      <Header />
      <main className="container section page-enter">
        <div style={{ maxWidth: 600, margin: '0 auto 48px', textAlign: 'center' }}>
          <h1 className="section-title">{t('title')}</h1>
          <input className="input" style={{ fontSize: '18px', padding: '16px 24px', borderRadius: 'var(--radius-xl)' }}
            placeholder={t('placeholder')} value={query} onChange={e => handleSearch(e.target.value)} autoFocus />
        </div>
        {results.length > 0 && (
          <div className="grid grid-4">
            {results.map((p: any) => (
              <a key={p._id} href={`/${locale}/products/${p._id}`} className="card">
                <div style={{ aspectRatio: '3/4', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
                </div>
                <div style={{ padding: '16px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 600 }}>{p.name?.[locale]}</h3>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--primary)', marginTop: '8px' }}>{formatPrice(p.price)}</div>
                </div>
              </a>
            ))}
          </div>
        )}
        {query.length >= 2 && results.length === 0 && (
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>{t('noResults')}</p>
        )}
      </main>
    </>
  );
}
