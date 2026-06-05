'use client';

import { useLocale } from 'next-intl';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState, use } from 'react';
import api from '@/lib/api';
import { useCurrency } from '@/contexts/CurrencyContext';

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const locale = useLocale();
  const { token } = useAuth();
  const { formatPrice } = useCurrency();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (token) api.get<any>(`/orders/${id}`, token).then(setOrder).catch(() => {});
  }, [token, id]);

  if (!order) return <><Header /><main className="container section"><div className="skeleton" style={{ height: 300 }} /></main></>;

  return (
    <>
      <Header />
      <main className="container section page-enter">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800 }}>#{order.orderNumber}</h1>
          <span className={`badge badge-${order.orderStatus === 'delivered' ? 'success' : 'primary'}`}>{order.orderStatus}</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 32 }}>
          <div>
            <div className="card" style={{ padding: 24, marginBottom: 16 }}>
              <h3 style={{ fontWeight: 700, marginBottom: 16 }}>{locale === 'ar' ? 'المنتجات' : 'Items'}</h3>
              {(order.items || []).map((item: any, i: number) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ width: 48, height: 48, background: 'var(--bg-tertiary)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📷</div>
                  <div style={{ flex: 1 }}><p style={{ fontWeight: 600 }}>{item.name?.[locale]}</p><p style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{item.variant?.size} × {item.quantity}</p></div>
                  <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{item.subtotal} {order.currency}</span>
                </div>
              ))}
            </div>
            {order.paymentStatus === 'pending' && (
              <div className="card" style={{ padding: 24 }}>
                <h3 style={{ fontWeight: 700, marginBottom: 16 }}>{locale === 'ar' ? 'رفع إثبات الدفع' : 'Upload Payment Proof'}</h3>
                <input type="file" accept="image/*" className="input" />
                <button className="btn btn-primary" style={{ marginTop: 16 }}>{locale === 'ar' ? 'رفع' : 'Upload'}</button>
              </div>
            )}
          </div>
          <div className="card card-glass" style={{ padding: 24, height: 'fit-content', position: 'sticky', top: 'calc(var(--header-height) + 24px)' }}>
            <h3 style={{ fontWeight: 700, marginBottom: 16 }}>{locale === 'ar' ? 'ملخص الطلب' : 'Summary'}</h3>
            {[
              [locale === 'ar' ? 'الحالة' : 'Status', order.orderStatus],
              [locale === 'ar' ? 'الدفع' : 'Payment', order.paymentStatus],
              [locale === 'ar' ? 'الشحن' : 'Shipping', `${order.shippingFee || 0} ${order.currency}`],
              [locale === 'ar' ? 'الإجمالي' : 'Total', `${order.total} ${order.currency}`],
            ].map(([l, v]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{l}</span><span style={{ fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
