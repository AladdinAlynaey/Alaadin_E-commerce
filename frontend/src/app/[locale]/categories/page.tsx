'use client';

import { useLocale } from 'next-intl';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function CategoriesPage() {
  const locale = useLocale();
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    api.get<any[]>('/categories').then(setCategories).catch(() => {});
  }, []);

  return (
    <>
      <Header />
      <main className="container section page-enter">
        <h1 className="section-title">{locale === 'ar' ? 'التصنيفات' : 'Categories'}</h1>
        <div className="grid grid-4">
          {categories.map(cat => (
            <a key={cat._id} href={`/${locale}/products?category=${cat._id}`} className="card" style={{ padding: 32, textAlign: 'center', transition: 'all 200ms ease' }}>
              <span style={{ fontSize: 48, display: 'block', marginBottom: 16 }}>{cat.icon || '📁'}</span>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{cat.name?.[locale]}</h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{cat.description?.[locale] || ''}</p>
            </a>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
