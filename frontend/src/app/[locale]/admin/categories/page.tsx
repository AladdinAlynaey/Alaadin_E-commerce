'use client';

import { useLocale } from 'next-intl';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import adminStyles from '../admin.module.css';

export default function AdminCategoriesPage() {
  const locale = useLocale();
  const { token } = useAuth();
  const [categories, setCategories] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: { ar: '', en: '' }, slug: { ar: '', en: '' }, description: { ar: '', en: '' } });

  useEffect(() => {
    api.get<any[]>('/categories').then(setCategories).catch(() => {});
  }, []);

  const handleCreate = async () => {
    if (!token) return;
    await api.post('/categories', form, token);
    const updated = await api.get<any[]>('/categories');
    setCategories(updated);
    setShowForm(false);
    setForm({ name: { ar: '', en: '' }, slug: { ar: '', en: '' }, description: { ar: '', en: '' } });
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    await api.delete(`/categories/${id}`, token);
    setCategories(prev => prev.filter(c => c._id !== id));
  };

  return (
    <div className="page-enter">
      <div className={adminStyles.adminPageHeader}>
        <h1 style={{ fontSize: 28, fontWeight: 800 }}>{locale === 'ar' ? 'التصنيفات' : 'Categories'}</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>+ {locale === 'ar' ? 'تصنيف جديد' : 'New Category'}</button>
      </div>
      {showForm && (
        <div className="card" style={{ padding: 24, marginBottom: 24 }}>
          <div className={adminStyles.formGrid}>
            <div className="input-group"><label>Name (AR)</label><input className="input" value={form.name.ar} onChange={e => setForm({...form, name: {...form.name, ar: e.target.value}})} /></div>
            <div className="input-group"><label>Name (EN)</label><input className="input" value={form.name.en} onChange={e => setForm({...form, name: {...form.name, en: e.target.value}})} /></div>
            <div className="input-group"><label>Slug (AR)</label><input className="input" value={form.slug.ar} onChange={e => setForm({...form, slug: {...form.slug, ar: e.target.value}})} /></div>
            <div className="input-group"><label>Slug (EN)</label><input className="input" value={form.slug.en} onChange={e => setForm({...form, slug: {...form.slug, en: e.target.value}})} /></div>
          </div>
          <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={handleCreate}>{locale === 'ar' ? 'إنشاء' : 'Create'}</button>
        </div>
      )}
      <div className="grid grid-4">
        {categories.map(c => (
          <div key={c._id} className="card" style={{ padding: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{c.name?.[locale]}</h3>
            <p style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 12 }}>{c.slug?.[locale]}</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-ghost btn-sm" style={{ flex: 1 }}>{locale === 'ar' ? 'تعديل' : 'Edit'}</button>
              <button className="btn btn-ghost btn-sm" style={{ color: 'var(--error)' }} onClick={() => handleDelete(c._id)}>✕</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
