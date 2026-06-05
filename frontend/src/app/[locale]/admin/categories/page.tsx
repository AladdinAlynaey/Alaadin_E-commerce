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
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  
  const initialForm = {
    name: { ar: '', en: '' },
    slug: { ar: '', en: '' },
    description: { ar: '', en: '' },
    parent: '',
  };
  
  const [form, setForm] = useState(initialForm);

  const fetchCategories = async () => {
    try {
      const flatTree = await api.get<any[]>('/categories/tree-flat');
      setCategories(flatTree);
    } catch {
      // Fallback
      api.get<any[]>('/categories').then(setCategories).catch(() => {});
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreate = async () => {
    if (!token) return;
    const data = {
      ...form,
      parent: form.parent || null,
    };
    await api.post('/categories', data, token);
    await fetchCategories();
    setShowForm(false);
    setForm(initialForm);
  };

  const handleUpdate = async () => {
    if (!token || !editingCategory) return;
    const data = {
      ...form,
      parent: form.parent || null,
    };
    await api.put(`/categories/${editingCategory._id}`, data, token);
    await fetchCategories();
    setShowForm(false);
    setEditingCategory(null);
    setForm(initialForm);
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    if (!window.confirm(locale === 'ar' ? 'هل أنت متأكد من الحذف؟' : 'Are you sure you want to delete this category?')) return;
    await api.delete(`/categories/${id}`, token);
    await fetchCategories();
  };

  const startEdit = (c: any) => {
    setEditingCategory(c);
    setForm({
      name: { ar: c.name?.ar || '', en: c.name?.en || '' },
      slug: { ar: c.slug?.ar || '', en: c.slug?.en || '' },
      description: { ar: c.description?.ar || '', en: c.description?.en || '' },
      parent: c.parent?._id || c.parent || '',
    });
    setShowForm(true);
  };

  // Helper to check if a category is a descendant of the editing category (circular reference check)
  const isDescendant = (catId: string, parentId: string): boolean => {
    let current = categories.find(c => c._id === catId);
    while (current) {
      const pId = current.parent?._id || current.parent;
      if (!pId) break;
      if (String(pId) === String(parentId)) return true;
      current = categories.find(c => c._id === String(pId));
    }
    return false;
  };

  const isAr = locale === 'ar';

  return (
    <div className="page-enter">
      <div className={adminStyles.adminPageHeader}>
        <h1 style={{ fontSize: 28, fontWeight: 800 }}>{isAr ? 'التصنيفات' : 'Categories'}</h1>
        <button 
          className="btn btn-primary" 
          onClick={() => {
            setEditingCategory(null);
            setForm(initialForm);
            setShowForm(!showForm);
          }}
        >
          {showForm ? (isAr ? 'إغلاق النموذج' : 'Close Form') : `+ ${isAr ? 'تصنيف جديد' : 'New Category'}`}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ padding: 24, marginBottom: 24 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 16 }}>
            {editingCategory ? (isAr ? 'تعديل التصنيف' : 'Edit Category') : (isAr ? 'إضافة تصنيف جديد' : 'Add New Category')}
          </h3>
          <div className={adminStyles.formGrid}>
            <div className="input-group">
              <label>{isAr ? 'الاسم (بالعربية)' : 'Name (AR)'}</label>
              <input className="input" value={form.name.ar} onChange={e => setForm({...form, name: {...form.name, ar: e.target.value}})} />
            </div>
            <div className="input-group">
              <label>{isAr ? 'الاسم (بالإنجليزية)' : 'Name (EN)'}</label>
              <input className="input" value={form.name.en} onChange={e => setForm({...form, name: {...form.name, en: e.target.value}})} />
            </div>
            <div className="input-group">
              <label>{isAr ? 'الرابط المختصر (AR)' : 'Slug (AR)'}</label>
              <input className="input" value={form.slug.ar} onChange={e => setForm({...form, slug: {...form.slug, ar: e.target.value}})} />
            </div>
            <div className="input-group">
              <label>{isAr ? 'الرابط المختصر (EN)' : 'Slug (EN)'}</label>
              <input className="input" value={form.slug.en} onChange={e => setForm({...form, slug: {...form.slug, en: e.target.value}})} />
            </div>
            <div className="input-group">
              <label>{isAr ? 'التصنيف الأب' : 'Parent Category'}</label>
              <select 
                className="input" 
                value={form.parent} 
                onChange={e => setForm({...form, parent: e.target.value})}
              >
                <option value="">{isAr ? 'بدون (تصنيف رئيسي)' : 'None (Root Category)'}</option>
                {categories
                  .filter(c => !editingCategory || (c._id !== editingCategory._id && !isDescendant(c._id, editingCategory._id)))
                  .map(c => (
                    <option key={c._id} value={c._id}>
                      {'\u00A0'.repeat((c.depth || 0) * 4)}{c.depth > 0 ? '↳ ' : ''}{c.name?.[locale]}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
            <button 
              className="btn btn-primary" 
              onClick={editingCategory ? handleUpdate : handleCreate}
            >
              {editingCategory ? (isAr ? 'تحديث' : 'Update') : (isAr ? 'إنشاء' : 'Create')}
            </button>
            {editingCategory && (
              <button 
                className="btn btn-secondary" 
                onClick={() => {
                  setEditingCategory(null);
                  setForm(initialForm);
                  setShowForm(false);
                }}
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Hierarchical tree listing representation */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: isAr ? 'right' : 'left' }}>
          <thead>
            <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '16px 24px', fontWeight: 700 }}>{isAr ? 'التصنيف' : 'Category Name'}</th>
              <th style={{ padding: '16px 24px', fontWeight: 700 }}>{isAr ? 'التصنيف الأب' : 'Parent'}</th>
              <th style={{ padding: '16px 24px', fontWeight: 700 }}>Slug</th>
              <th style={{ padding: '16px 24px', fontWeight: 700, textAlign: 'center' }}>{isAr ? 'الخيارات' : 'Actions'}</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => {
              const pName = c.parent?.name?.[locale] || (c.parent ? (isAr ? 'تنزيل الأب...' : 'Loading parent...') : '-');
              return (
                <tr key={c._id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s' }}>
                  <td style={{ padding: '16px 24px', paddingLeft: isAr ? '24px' : `${24 + (c.depth || 0) * 24}px`, paddingRight: isAr ? `${24 + (c.depth || 0) * 24}px` : '24px' }}>
                    <span style={{ color: c.depth > 0 ? 'var(--text-secondary)' : 'var(--text-primary)', fontWeight: c.depth === 0 ? 700 : 500 }}>
                      {c.depth > 0 ? '↳ ' : ''}{c.name?.[locale]}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', color: 'var(--text-tertiary)' }}>{pName}</td>
                  <td style={{ padding: '16px 24px', color: 'var(--text-tertiary)', fontSize: 13 }}>{c.slug?.[locale]}</td>
                  <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', gap: 8 }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => startEdit(c)}>
                        {isAr ? 'تعديل' : 'Edit'}
                      </button>
                      <button className="btn btn-ghost btn-sm" style={{ color: 'var(--error)' }} onClick={() => handleDelete(c._id)}>
                        ✕
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {categories.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: '40px 24px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                  {isAr ? 'لا توجد تصنيفات مضافة' : 'No categories found'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
