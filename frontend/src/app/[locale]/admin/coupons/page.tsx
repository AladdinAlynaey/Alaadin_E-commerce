'use client';

import { useLocale } from 'next-intl';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import adminStyles from '../admin.module.css';

export default function AdminCouponsPage() {
  const locale = useLocale();
  const { token } = useAuth();
  const [coupons, setCoupons] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ code: '', type: 'percentage', value: 0, minOrderValue: 0, maxDiscount: 0, expiresAt: '' });

  useEffect(() => {
    if (token) api.get<any[]>('/coupons', token).then(setCoupons).catch(() => {});
  }, [token]);

  const handleCreate = async () => {
    if (!token) return;
    await api.post('/coupons', form, token);
    const updated = await api.get<any[]>('/coupons', token);
    setCoupons(updated);
    setShowForm(false);
  };

  return (
    <div className="page-enter">
      <div className={adminStyles.adminPageHeader}>
        <h1 style={{ fontSize: 28, fontWeight: 800 }}>{locale === 'ar' ? 'الكوبونات' : 'Coupons'}</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>{locale === 'ar' ? '+ كوبون جديد' : '+ New Coupon'}</button>
      </div>
      {showForm && (
        <div className="card" style={{ padding: 24, marginBottom: 24 }}>
          <div className={adminStyles.formGrid3}>
            <div className="input-group"><label>Code</label><input className="input" value={form.code} onChange={e => setForm({...form, code: e.target.value})} /></div>
            <div className="input-group"><label>Type</label><select className="input" value={form.type} onChange={e => setForm({...form, type: e.target.value})}><option value="percentage">%</option><option value="fixed">Fixed</option></select></div>
            <div className="input-group"><label>Value</label><input type="number" className="input" value={form.value} onChange={e => setForm({...form, value: +e.target.value})} /></div>
            <div className="input-group"><label>Min Order</label><input type="number" className="input" value={form.minOrderValue} onChange={e => setForm({...form, minOrderValue: +e.target.value})} /></div>
            <div className="input-group"><label>Max Discount</label><input type="number" className="input" value={form.maxDiscount} onChange={e => setForm({...form, maxDiscount: +e.target.value})} /></div>
            <div className="input-group"><label>Expires</label><input type="date" className="input" value={form.expiresAt} onChange={e => setForm({...form, expiresAt: e.target.value})} /></div>
          </div>
          <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={handleCreate}>{locale === 'ar' ? 'إنشاء' : 'Create'}</button>
        </div>
      )}
      <div className="card" style={{ overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead><tr style={{ borderBottom: '1px solid var(--border)' }}>
            {['Code', 'Type', 'Value', 'Used', 'Expires', 'Status'].map(h => (
              <th key={h} style={{ padding: '12px 16px', textAlign: 'start', fontWeight: 600, color: 'var(--text-secondary)' }}>{h}</th>
            ))}</tr></thead>
          <tbody>{coupons.map(c => (
            <tr key={c._id} style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '12px 16px', fontWeight: 700 }}>{c.code}</td>
              <td style={{ padding: '12px 16px' }}>{c.type === 'percentage' ? `${c.value}%` : c.value}</td>
              <td style={{ padding: '12px 16px' }}>{c.type}</td>
              <td style={{ padding: '12px 16px' }}>{c.usedCount}/{c.usageLimit > 0 ? c.usageLimit : '∞'}</td>
              <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{new Date(c.expiresAt).toLocaleDateString()}</td>
              <td style={{ padding: '12px 16px' }}><span className={`badge badge-${c.isActive ? 'success' : 'error'}`}>{c.isActive ? 'Active' : 'Inactive'}</span></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
