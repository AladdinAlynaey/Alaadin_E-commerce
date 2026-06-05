'use client';

import { useLocale } from 'next-intl';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function AdminOrdersPage() {
  const locale = useLocale();
  const { token } = useAuth();
  const [orders, setOrders] = useState<any>({ data: [], total: 0 });
  const [filter, setFilter] = useState('');

  useEffect(() => {
    if (token) {
      const q = filter ? `&status=${filter}` : '';
      api.get<any>(`/orders?limit=50${q}`, token).then(setOrders).catch(() => {});
    }
  }, [token, filter]);

  const updatePayment = async (id: string, status: string) => {
    if (!token) return;
    await api.put(`/orders/${id}/payment-status`, { paymentStatus: status }, token);
    const q = filter ? `&status=${filter}` : '';
    api.get<any>(`/orders?limit=50${q}`, token).then(setOrders);
  };

  const statuses = ['pending', 'payment_uploaded', 'payment_approved', 'processing', 'shipped', 'delivered', 'cancelled'];

  return (
    <div className="page-enter">
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 16 }}>{locale === 'ar' ? 'الطلبات' : 'Orders'} ({orders.total})</h1>
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        <button className={`btn btn-sm ${!filter ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setFilter('')}>{locale === 'ar' ? 'الكل' : 'All'}</button>
        {statuses.map(s => (
          <button key={s} className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setFilter(s)}>{s}</button>
        ))}
      </div>
      <div className="card" style={{ overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead><tr style={{ borderBottom: '1px solid var(--border)' }}>
            {['#', locale === 'ar' ? 'العميل' : 'Customer', locale === 'ar' ? 'الحالة' : 'Status', locale === 'ar' ? 'الدفع' : 'Payment', locale === 'ar' ? 'المبلغ' : 'Amount', locale === 'ar' ? 'إجراءات' : 'Actions'].map(h => (
              <th key={h} style={{ padding: '12px 16px', textAlign: 'start', fontWeight: 600, color: 'var(--text-secondary)' }}>{h}</th>
            ))}</tr></thead>
          <tbody>{(orders.data || []).map((o: any) => (
            <tr key={o._id} style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '12px 16px', fontWeight: 600 }}>{o.orderNumber}</td>
              <td style={{ padding: '12px 16px' }}>{o.user?.name?.[locale] || o.user?.email}</td>
              <td style={{ padding: '12px 16px' }}><span className="badge badge-primary">{o.orderStatus}</span></td>
              <td style={{ padding: '12px 16px' }}><span className={`badge badge-${o.paymentStatus === 'approved' ? 'success' : o.paymentStatus === 'uploaded' ? 'warning' : 'error'}`}>{o.paymentStatus}</span></td>
              <td style={{ padding: '12px 16px', fontWeight: 700 }}>{o.total?.toLocaleString()} {o.currency}</td>
              <td style={{ padding: '12px 16px', display: 'flex', gap: 8 }}>
                {o.paymentStatus === 'uploaded' && <>
                  <button className="btn btn-sm btn-primary" onClick={() => updatePayment(o._id, 'approved')}>✓</button>
                  <button className="btn btn-sm btn-ghost" style={{ color: 'var(--error)' }} onClick={() => updatePayment(o._id, 'rejected')}>✕</button>
                </>}
              </td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
