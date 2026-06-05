'use client';

import { useLocale } from 'next-intl';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import adminStyles from '../../admin.module.css';

export default function AdminProductFormPage() {
  const locale = useLocale();
  const { token } = useAuth();
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    name: { ar: '', en: '' },
    description: { ar: '', en: '' },
    price: { YER: 0, SAR: 0, USD: 0 },
    category: '',
    variants: [{ size: 'M', color: { name: { ar: 'افتراضي', en: 'Default' }, hex: '#000000' }, stock: 0 }],
    tags: '',
    isFeatured: false,
    isFlashDeal: false,
    images: [] as string[],
  });

  useEffect(() => {
    api.get<any[]>('/categories/tree-flat')
      .then(setCategories)
      .catch(() => {
        api.get<any[]>('/categories').then(setCategories).catch(() => {});
      });
  }, []);

  const handleSubmit = async () => {
    if (!token) return;
    const data = {
      ...form,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
    };
    await api.post('/products', data, token);
    router.push(`/${locale}/admin/products`);
  };

  const u = (key: string, value: any) => setForm(prev => ({ ...prev, [key]: value }));

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const newImages = [...form.images];
      for (let i = 0; i < files.length; i++) {
        const res = await api.upload<any>('/upload', files[i], 'products', token || undefined);
        newImages.push(res.url);
      }
      u('images', newImages);
    } catch (err) {
      console.error('Upload error:', err);
      alert(locale === 'ar' ? 'فشل تحميل الصورة' : 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = form.images.filter((_, i) => i !== index);
    u('images', newImages);
  };

  const handleSetPrimary = (index: number) => {
    if (index === 0) return;
    const newImages = [...form.images];
    const [target] = newImages.splice(index, 1);
    newImages.unshift(target);
    u('images', newImages);
  };

  return (
    <div className="page-enter">
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 32 }}>
        {locale === 'ar' ? 'إضافة منتج جديد' : 'Add New Product'}
      </h1>
      <div style={{ maxWidth: 800 }}>
        {/* Basic Info */}
        <div className="card" style={{ padding: 32, marginBottom: 24 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 16 }}>{locale === 'ar' ? 'المعلومات الأساسية' : 'Basic Info'}</h3>
          <div className={adminStyles.formGrid}>
            <div className="input-group"><label>Name (AR)</label><input className="input" value={form.name.ar} onChange={e => u('name', {...form.name, ar: e.target.value})} /></div>
            <div className="input-group"><label>Name (EN)</label><input className="input" value={form.name.en} onChange={e => u('name', {...form.name, en: e.target.value})} /></div>
          </div>
          <div className={`${adminStyles.formGrid}`} style={{ marginTop: 16 }}>
            <div className="input-group"><label>Description (AR)</label><textarea className="input" rows={3} value={form.description.ar} onChange={e => u('description', {...form.description, ar: e.target.value})} /></div>
            <div className="input-group"><label>Description (EN)</label><textarea className="input" rows={3} value={form.description.en} onChange={e => u('description', {...form.description, en: e.target.value})} /></div>
          </div>
          <div className="input-group" style={{ marginTop: 16 }}>
            <label>{locale === 'ar' ? 'التصنيف' : 'Category'}</label>
            <select className="input" value={form.category} onChange={e => u('category', e.target.value)}>
              <option value="">{locale === 'ar' ? 'اختر تصنيفاً' : 'Select Category'}</option>
              {categories.map(c => (
                <option key={c._id} value={c._id}>
                  {'\u00A0'.repeat((c.depth || 0) * 4)}{c.depth > 0 ? '↳ ' : ''}{c.name?.[locale]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Product Images */}
        <div className="card" style={{ padding: 32, marginBottom: 24 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 8 }}>{locale === 'ar' ? 'صور المنتج' : 'Product Images'}</h3>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>
            {locale === 'ar' ? 'الصورة الأولى ستكون صورة الغلاف للمنتج.' : 'The first image will be the primary cover image.'}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 16, marginBottom: 16 }}>
            {form.images.map((imgUrl, index) => (
              <div
                key={index}
                style={{
                  position: 'relative',
                  width: '100%',
                  paddingBottom: '100%',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  background: 'var(--bg-tertiary)',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={imgUrl}
                  alt={`Product ${index}`}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                
                {/* Image badges / controls */}
                <div
                  style={{
                    position: 'absolute',
                    top: 6,
                    right: 6,
                    display: 'flex',
                    gap: 4,
                    zIndex: 10,
                  }}
                >
                  {index === 0 ? (
                    <span
                      style={{
                        padding: '2px 6px',
                        background: 'var(--primary)',
                        color: 'white',
                        fontSize: 10,
                        fontWeight: 700,
                        borderRadius: 4,
                      }}
                    >
                      {locale === 'ar' ? 'الغلاف' : 'Cover'}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSetPrimary(index)}
                      style={{
                        padding: '2px 6px',
                        background: 'rgba(0,0,0,0.6)',
                        color: 'white',
                        fontSize: 10,
                        border: 'none',
                        borderRadius: 4,
                        cursor: 'pointer',
                      }}
                    >
                      ⭐
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    style={{
                      width: 20,
                      height: 20,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(214, 48, 49, 0.9)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      fontSize: 10,
                      cursor: 'pointer',
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}

            {/* Add Image Box */}
            <label
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                aspectRatio: '1',
                borderRadius: 'var(--radius-md)',
                border: '2px dashed var(--border)',
                background: 'var(--bg-secondary)',
                cursor: uploading ? 'not-allowed' : 'pointer',
                transition: 'all var(--transition-fast)',
              }}
            >
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                style={{ display: 'none' }}
              />
              <span style={{ fontSize: 24, marginBottom: 4 }}>📷</span>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontWeight: 600 }}>
                {uploading ? (locale === 'ar' ? 'جاري الرفع...' : 'Uploading...') : (locale === 'ar' ? 'إضافة صورة' : 'Add Image')}
              </span>
            </label>
          </div>
        </div>

        {/* Pricing */}
        <div className="card" style={{ padding: 32, marginBottom: 24 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 16 }}>{locale === 'ar' ? 'التسعير' : 'Pricing'}</h3>
          <div className={adminStyles.formGrid3}>
            <div className="input-group"><label>YER ﷼</label><input type="number" className="input" value={form.price.YER} onChange={e => u('price', {...form.price, YER: +e.target.value})} /></div>
            <div className="input-group"><label>SAR ر.س</label><input type="number" className="input" value={form.price.SAR} onChange={e => u('price', {...form.price, SAR: +e.target.value})} /></div>
            <div className="input-group"><label>USD $</label><input type="number" className="input" value={form.price.USD} onChange={e => u('price', {...form.price, USD: +e.target.value})} /></div>
          </div>
        </div>

        {/* Inventory */}
        <div className="card" style={{ padding: 32, marginBottom: 24 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 16 }}>{locale === 'ar' ? 'إدارة المخزون' : 'Inventory Management'}</h3>
          <div className={adminStyles.formGrid}>
            <div className="input-group">
              <label>{locale === 'ar' ? 'كمية المخزون' : 'Stock Quantity'}</label>
              <input 
                type="number" 
                className="input" 
                value={form.variants[0]?.stock || 0} 
                onChange={e => {
                  const stockVal = Math.max(0, +e.target.value);
                  const updatedVariants = [...form.variants];
                  if (updatedVariants[0]) {
                    updatedVariants[0].stock = stockVal;
                  } else {
                    updatedVariants.push({ size: 'M', color: { name: { ar: 'افتراضي', en: 'Default' }, hex: '#000000' }, stock: stockVal });
                  }
                  u('variants', updatedVariants);
                }} 
              />
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="card" style={{ padding: 32, marginBottom: 24 }}>
          <h3 style={{ fontWeight: 700, marginBottom: 16 }}>{locale === 'ar' ? 'الخيارات' : 'Options'}</h3>
          <div className={adminStyles.formGrid}>
            <div className="input-group"><label>Tags ({locale === 'ar' ? 'مفصولة بفاصلة' : 'comma separated'})</label><input className="input" value={form.tags} onChange={e => u('tags', e.target.value)} /></div>
          </div>
          <div style={{ display: 'flex', gap: 24, marginTop: 16 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input type="checkbox" checked={form.isFeatured} onChange={e => u('isFeatured', e.target.checked)} /> {locale === 'ar' ? 'مميز' : 'Featured'}
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input type="checkbox" checked={form.isFlashDeal} onChange={e => u('isFlashDeal', e.target.checked)} /> {locale === 'ar' ? 'عرض خاطف' : 'Flash Deal'}
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-primary btn-lg" onClick={handleSubmit}>{locale === 'ar' ? 'إضافة المنتج' : 'Add Product'}</button>
          <a href={`/${locale}/admin/products`} className="btn btn-secondary btn-lg">{locale === 'ar' ? 'إلغاء' : 'Cancel'}</a>
        </div>
      </div>
    </div>
  );
}
