'use client';

import { useLocale } from 'next-intl';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import adminStyles from '../admin.module.css';

export default function AdminUsersPage() {
  const locale = useLocale();
  const { token } = useAuth();
  const [users, setUsers] = useState<any>({ data: [], total: 0 });
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (token) api.get<any>(`/users?search=${search}&limit=20`, token).then(setUsers).catch(() => {});
  }, [token, search]);

  return (
    <div className="page-enter">
      <div className={adminStyles.adminPageHeader}>
        <h1 style={{ fontSize: 28, fontWeight: 800 }}>{locale === 'ar' ? 'المستخدمون' : 'Users'} ({users.total})</h1>
        <input className="input" style={{ width: '100%', maxWidth: 300 }} placeholder={locale === 'ar' ? 'بحث...' : 'Search...'} value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <div className="card" style={{ overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {[locale === 'ar' ? 'الاسم' : 'Name', 'Email', locale === 'ar' ? 'الدور' : 'Role', locale === 'ar' ? 'الحالة' : 'Status', locale === 'ar' ? 'التاريخ' : 'Date'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'start', fontWeight: 600, color: 'var(--text-secondary)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(users.data || []).map((u: any) => (
              <tr key={u._id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '12px 16px', fontWeight: 600 }}>{u.name?.[locale] || u.name?.en}</td>
                <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{u.email}</td>
                <td style={{ padding: '12px 16px' }}><span className={`badge badge-${u.role === 'admin' ? 'primary' : 'success'}`}>{u.role}</span></td>
                <td style={{ padding: '12px 16px' }}><span className={`badge badge-${u.isActive ? 'success' : 'error'}`}>{u.isActive ? '✓' : '✕'}</span></td>
                <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
