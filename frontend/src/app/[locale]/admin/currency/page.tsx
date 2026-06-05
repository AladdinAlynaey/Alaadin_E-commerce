'use client';

import { useLocale } from 'next-intl';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function AdminCurrencyPage() {
  const locale = useLocale();
  const { token } = useAuth();
  const [currencies, setCurrencies] = useState<any[]>([]);

  useEffect(() => {
    api.get<any[]>('/currencies').then(setCurrencies).catch(() => {});
  }, []);

  const updateRate = async (code: string, rate: number) => {
    if (!token) return;
    await api.put(`/currencies/${code}/rate`, { rate }, token);
    const updated = await api.get<any[]>('/currencies');
    setCurrencies(updated);
  };

  return (
    <div className="page-enter">
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 32 }}>{locale === 'ar' ? 'إدارة العملات' : 'Currency Management'}</h1>
      <div className="grid grid-3">
        {currencies.map(c => (
          <div key={c.code} className="card card-glass" style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 700 }}>{c.symbol} {c.code}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{c.name?.[locale]}</p>
              </div>
              {c.isDefault && <span className="badge badge-primary">Default</span>}
            </div>
            <div className="input-group">
              <label>{locale === 'ar' ? 'سعر الصرف' : 'Exchange Rate'}</label>
              <input type="number" step="0.0001" className="input" defaultValue={c.rate}
                onBlur={e => updateRate(c.code, parseFloat(e.target.value))} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
