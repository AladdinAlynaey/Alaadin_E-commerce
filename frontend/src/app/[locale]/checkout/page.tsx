'use client';

import { useTranslations, useLocale } from 'next-intl';
import Header from '@/components/layout/Header';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import api from '@/lib/api';

export default function CheckoutPage() {
  const t = useTranslations('checkout');
  const locale = useLocale();
  const { user, token } = useAuth();
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState({ street: '', city: '', state: '', country: '', zipCode: '', phone: '' });
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  const handlePlaceOrder = async () => {
    if (!token) return;
    try {
      const order = await api.post<any>('/orders', {
        shippingAddress: address, items: [], subtotal: 0, total: 0, currency: 'YER',
      }, token);
      setOrderNumber(order.orderNumber);
      setOrderPlaced(true);
    } catch { /* handle error */ }
  };

  if (orderPlaced) {
    return (
      <>
        <Header />
        <main className="container section page-enter" style={{ textAlign: 'center', padding: '80px 0' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>✓</div>
          <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '8px' }}>{t('orderPlaced')}</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>{t('orderNumber')}: {orderNumber}</p>
          <a href={`/${locale}/account`} className="btn btn-primary">{locale === 'ar' ? 'طلباتي' : 'My Orders'}</a>
        </main>
      </>
    );
  }

  const fields = [
    { key: 'street', label: t('street') }, { key: 'city', label: t('city') },
    { key: 'state', label: t('state') }, { key: 'country', label: t('country') },
    { key: 'phone', label: t('phone') },
  ];

  return (
    <>
      <Header />
      <main className="container section page-enter">
        <h1 className="section-title">{t('title')}</h1>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <div className="card" style={{ padding: '32px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '24px' }}>{t('shippingAddress')}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {fields.map(f => (
                <div key={f.key} className="input-group">
                  <label>{f.label}</label>
                  <input className="input" value={(address as any)[f.key]} onChange={e => setAddress({ ...address, [f.key]: e.target.value })} />
                </div>
              ))}
            </div>
            <div className="input-group" style={{ marginTop: '16px' }}>
              <label>{t('notes')}</label>
              <textarea className="input" rows={3} />
            </div>
            <button className="btn btn-primary btn-full btn-lg" style={{ marginTop: '24px' }} onClick={handlePlaceOrder}>
              {t('placeOrder')}
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
