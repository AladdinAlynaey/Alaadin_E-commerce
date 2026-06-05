'use client';

import { useTranslations, useLocale } from 'next-intl';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function AccountPage() {
  const t = useTranslations('account');
  const locale = useLocale();
  const { user, token } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [tab, setTab] = useState('orders');

  useEffect(() => {
    if (token) {
      api.get<any>('/orders/my-orders?limit=10', token).then(r => setOrders(r.data || [])).catch(() => {});
    }
  }, [token]);

  const tabs = [
    { key: 'orders', label: t('orders') },
    { key: 'profile', label: t('profile') },
    { key: 'addresses', label: t('addresses') },
    { key: 'preferences', label: t('preferences') },
  ];

  const statusColors: any = { pending: 'warning', payment_uploaded: 'primary', payment_approved: 'success', processing: 'primary', shipped: 'primary', delivered: 'success', cancelled: 'error' };

  return (
    <>
      <Header />
      <main className="container section page-enter">
        <h1 className="section-title">{t('title')}</h1>
        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '32px' }}>
          <aside style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {tabs.map(tb => (
              <button key={tb.key} onClick={() => setTab(tb.key)} className={`btn btn-ghost`}
                style={{ justifyContent: 'flex-start', background: tab === tb.key ? 'var(--bg-tertiary)' : 'transparent', fontWeight: tab === tb.key ? 700 : 400 }}>
                {tb.label}
              </button>
            ))}
          </aside>
          <div>
            {tab === 'orders' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {orders.length === 0 ? (
                  <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '48px 0' }}>{t('noOrders')}</p>
                ) : orders.map((o: any) => (
                  <div key={o._id} className="card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ fontWeight: 700, marginBottom: '4px' }}>#{o.orderNumber}</h3>
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{new Date(o.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className={`badge badge-${statusColors[o.orderStatus] || 'primary'}`}>{o.orderStatus}</span>
                    <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{o.total} {o.currency}</span>
                  </div>
                ))}
              </div>
            )}
            {tab === 'profile' && user && (
              <div className="card" style={{ padding: '32px' }}>
                <h2 style={{ marginBottom: '24px', fontWeight: 700 }}>{t('profile')}</h2>
                <div className="grid grid-2" style={{ gap: '16px' }}>
                  <div className="input-group"><label>{locale === 'ar' ? 'الاسم بالعربية' : 'Name (AR)'}</label><input className="input" defaultValue={user.name?.ar} /></div>
                  <div className="input-group"><label>{locale === 'ar' ? 'الاسم بالإنجليزية' : 'Name (EN)'}</label><input className="input" defaultValue={user.name?.en} /></div>
                  <div className="input-group"><label>Email</label><input className="input" defaultValue={user.email} disabled /></div>
                </div>
                <button className="btn btn-primary" style={{ marginTop: '24px' }}>{locale === 'ar' ? 'حفظ' : 'Save'}</button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
