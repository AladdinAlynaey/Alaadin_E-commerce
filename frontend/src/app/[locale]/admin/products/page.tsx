'use client';

import { useLocale } from 'next-intl';
import { useAuth } from '@/contexts/AuthContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import adminStyles from '../admin.module.css';

export default function AdminProductsPage() {
  const locale = useLocale();
  const { token } = useAuth();
  const { formatPrice } = useCurrency();
  const [products, setProducts] = useState<any>({ data: [], total: 0 });
  const [search, setSearch] = useState('');

  useEffect(() => {
    const endpoint = search ? `/products/search?q=${search}&limit=30` : '/products?limit=30';
    api.get<any>(endpoint).then(r => setProducts(Array.isArray(r) ? { data: r, total: r.length } : r)).catch(() => {});
  }, [search]);

  const handleDelete = async (id: string) => {
    if (!token) return;
    await api.delete(`/products/${id}`, token);
    setProducts((prev: any) => ({ ...prev, data: prev.data.filter((p: any) => p._id !== id) }));
  };

  return (
    <div className="page-enter">
      <div className={adminStyles.adminPageHeader}>
        <h1 style={{ fontSize: 28, fontWeight: 800 }}>{locale === 'ar' ? 'المنتجات' : 'Products'} ({products.total})</h1>
        <div className={adminStyles.adminPageActions}>
          <input className="input" style={{ width: '100%', maxWidth: 240 }} placeholder={locale === 'ar' ? 'بحث...' : 'Search...'} value={search} onChange={e => setSearch(e.target.value)} />
          <a href={`/${locale}/admin/products/new`} className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>+ {locale === 'ar' ? 'منتج جديد' : 'New Product'}</a>
        </div>
      </div>
      <div className="card" style={{ overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead><tr style={{ borderBottom: '1px solid var(--border)' }}>
            {[locale === 'ar' ? 'المنتج' : 'Product', locale === 'ar' ? 'السعر' : 'Price', locale === 'ar' ? 'المخزون' : 'Stock', locale === 'ar' ? 'التقييم' : 'Rating', locale === 'ar' ? 'إجراءات' : 'Actions'].map(h => (
              <th key={h} style={{ padding: '12px 16px', textAlign: 'start', fontWeight: 600, color: 'var(--text-secondary)' }}>{h}</th>
            ))}</tr></thead>
          <tbody>{(products.data || []).map((p: any) => (
            <tr key={p._id} style={{ borderBottom: '1px solid var(--border)' }}>
              <td style={{ padding: '12px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 48, height: 48, background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
                  </div>
                  <span style={{ fontWeight: 600 }}>{p.name?.[locale]}</span>
                </div>
              </td>
              <td style={{ padding: '12px 16px', fontWeight: 700, color: 'var(--primary)' }}>{formatPrice(p.price)}</td>
              <td style={{ padding: '12px 16px' }}><span className={`badge badge-${(p.totalStock || 0) > 0 ? 'success' : 'error'}`}>{p.totalStock || 0}</span></td>
              <td style={{ padding: '12px 16px' }}>{'★'.repeat(Math.round(p.ratings?.average || 0))} ({p.ratings?.count || 0})</td>
              <td style={{ padding: '12px 16px' }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <a href={`/${locale}/admin/products/${p._id}`} className="btn btn-ghost btn-sm">{locale === 'ar' ? 'تعديل' : 'Edit'}</a>
                  <button className="btn btn-ghost btn-sm" style={{ color: 'var(--error)' }} onClick={() => handleDelete(p._id)}>{locale === 'ar' ? 'حذف' : 'Delete'}</button>
                </div>
              </td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
