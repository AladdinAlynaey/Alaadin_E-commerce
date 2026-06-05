'use client';

import { useLocale } from 'next-intl';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function AdminReviewsPage() {
  const locale = useLocale();
  const { token } = useAuth();
  const [reviews, setReviews] = useState<any>({ data: [] });

  useEffect(() => {
    if (token) api.get<any>('/reviews?limit=50', token).then(setReviews).catch(() => {});
  }, [token]);

  const moderate = async (id: string, approved: boolean) => {
    if (!token) return;
    await api.put(`/reviews/${id}/moderate`, { isApproved: approved }, token);
    setReviews((prev: any) => ({
      ...prev,
      data: prev.data.map((r: any) => r._id === id ? { ...r, isApproved: approved } : r),
    }));
  };

  return (
    <div className="page-enter">
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 32 }}>{locale === 'ar' ? 'التقييمات' : 'Reviews'}</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {(reviews.data || []).map((r: any) => (
          <div key={r._id} className="card" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontWeight: 700 }}>{r.user?.name?.[locale] || 'User'}</span>
                <span className="stars">{'★'.repeat(r.rating)}</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{r.comment}</p>
              <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 4 }}>{r.product?.name?.[locale]}</p>
            </div>
            <span className={`badge badge-${r.isApproved ? 'success' : 'warning'}`}>{r.isApproved ? '✓' : '⏳'}</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-sm btn-primary" onClick={() => moderate(r._id, true)}>✓</button>
              <button className="btn btn-sm btn-ghost" style={{ color: 'var(--error)' }} onClick={() => moderate(r._id, false)}>✕</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
