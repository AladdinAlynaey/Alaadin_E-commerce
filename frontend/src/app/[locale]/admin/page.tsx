'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function AdminDashboard() {
  const t = useTranslations('admin');
  const locale = useLocale();
  const { user, isAdmin, token } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<any>({});
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    if (!isAdmin && user) router.push(`/${locale}`);
  }, [isAdmin, user]);

  useEffect(() => {
    if (token && isAdmin) {
      api.get<any>('/orders/stats', token).then(setStats).catch(() => {});
      api.get<any>('/orders?limit=10', token).then(r => setOrders(r.data || [])).catch(() => {});
      api.get<any>('/products?limit=20', token).then(r => setProducts(r.data || [])).catch(() => {});
    }
  }, [token, isAdmin]);

  const kpis = [
    { label: t('revenue'), value: `${stats.revenue?.toLocaleString() || 0} ﷼`, color: 'var(--success)' },
    { label: t('totalOrders'), value: stats.total || 0, color: 'var(--primary)' },
    { label: t('pendingPayments'), value: stats.pending || 0, color: 'var(--warning)' },
    { label: t('totalProducts'), value: products.length, color: 'var(--accent)' },
  ];

  return (
    <div className="page-enter">
      <h1 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '32px' }}>{t('dashboard')}</h1>
      
      {/* KPI Cards Grid */}
      <div className="grid grid-4" style={{ marginBottom: '32px' }}>
        {kpis.map((kpi, i) => (
          <div key={i} className="card card-glass" style={{ padding: '24px' }}>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '8px' }}>{kpi.label}</p>
            <p style={{ fontSize: '28px', fontWeight: 800, color: kpi.color }}>{kpi.value}</p>
          </div>
        ))}
      </div>
      
      {/* Recent Orders */}
      <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>{t('recentOrders')}</h2>
      <div className="card" style={{ overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['#', locale === 'ar' ? 'الحالة' : 'Status', locale === 'ar' ? 'الدفع' : 'Payment', locale === 'ar' ? 'المبلغ' : 'Amount', locale === 'ar' ? 'التاريخ' : 'Date'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'start', fontWeight: 600, color: 'var(--text-secondary)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((o: any) => (
              <tr key={o._id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '12px 16px', fontWeight: 600 }}>{o.orderNumber}</td>
                <td style={{ padding: '12px 16px' }}><span className="badge badge-primary">{o.orderStatus}</span></td>
                <td style={{ padding: '12px 16px' }}><span className={`badge badge-${o.paymentStatus === 'approved' ? 'success' : 'warning'}`}>{o.paymentStatus}</span></td>
                <td style={{ padding: '12px 16px', fontWeight: 700 }}>{o.total} {o.currency}</td>
                <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{new Date(o.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
