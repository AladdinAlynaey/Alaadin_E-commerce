'use client';

import { useLocale } from 'next-intl';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import adminStyles from '../admin.module.css';

export default function AdminShippingPage() {
  const locale = useLocale();
  const { token } = useAuth();
  const [zones, setZones] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: { ar: '', en: '' }, cities: '', fee: 0, estimatedDelivery: { ar: '', en: '' } });

  useEffect(() => {
    api.get<any[]>('/shipping/zones').then(setZones).catch(() => {});
  }, []);

  const handleCreate = async () => {
    if (!token) return;
    await api.post('/shipping/zones', { ...form, cities: form.cities.split(',').map(c => c.trim()) }, token);
    const updated = await api.get<any[]>('/shipping/zones');
    setZones(updated);
    setShowForm(false);
  };

  return (
    <div className="page-enter">
      <div className={adminStyles.adminPageHeader}>
        <h1 style={{ fontSize: 28, fontWeight: 800 }}>{locale === 'ar' ? 'مناطق الشحن' : 'Shipping Zones'}</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>+ {locale === 'ar' ? 'منطقة جديدة' : 'New Zone'}</button>
      </div>
      {showForm && (
        <div className="card" style={{ padding: 24, marginBottom: 24 }}>
          <div className={adminStyles.formGrid}>
            <div className="input-group"><label>{locale === 'ar' ? 'الاسم (عربي)' : 'Name (AR)'}</label><input className="input" value={form.name.ar} onChange={e => setForm({...form, name: {...form.name, ar: e.target.value}})} /></div>
            <div className="input-group"><label>{locale === 'ar' ? 'الاسم (إنجليزي)' : 'Name (EN)'}</label><input className="input" value={form.name.en} onChange={e => setForm({...form, name: {...form.name, en: e.target.value}})} /></div>
            <div className="input-group"><label>{locale === 'ar' ? 'المدن (مفصولة بفاصلة)' : 'Cities (comma separated)'}</label><input className="input" value={form.cities} onChange={e => setForm({...form, cities: e.target.value})} /></div>
            <div className="input-group"><label>{locale === 'ar' ? 'رسوم الشحن' : 'Fee'}</label><input type="number" className="input" value={form.fee} onChange={e => setForm({...form, fee: +e.target.value})} /></div>
            <div className="input-group"><label>{locale === 'ar' ? 'التوصيل المتوقع (عربي)' : 'Est. Delivery (AR)'}</label><input className="input" value={form.estimatedDelivery.ar} onChange={e => setForm({...form, estimatedDelivery: {...form.estimatedDelivery, ar: e.target.value}})} /></div>
            <div className="input-group"><label>{locale === 'ar' ? 'التوصيل المتوقع (إنجليزي)' : 'Est. Delivery (EN)'}</label><input className="input" value={form.estimatedDelivery.en} onChange={e => setForm({...form, estimatedDelivery: {...form.estimatedDelivery, en: e.target.value}})} /></div>
          </div>
          <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={handleCreate}>{locale === 'ar' ? 'إنشاء' : 'Create'}</button>
        </div>
      )}
      <div className="grid grid-3">
        {zones.map(z => (
          <div key={z._id} className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{z.name?.[locale]}</h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>{z.cities?.join(', ')}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{z.fee} ﷼</span>
              <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{z.estimatedDelivery?.[locale]}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
