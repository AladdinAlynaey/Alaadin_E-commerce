'use client';

import { useLocale } from 'next-intl';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function TermsPage() {
  const locale = useLocale();
  return (
    <>
      <Header />
      <main className="container section page-enter" style={{ maxWidth: 800, margin: '0 auto' }}>
        <h1 className="section-title">{locale === 'ar' ? 'الشروط والأحكام' : 'Terms & Conditions'}</h1>
        <div className="card" style={{ padding: 32, lineHeight: 2, color: 'var(--text-secondary)' }}>
          <h2 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>{locale === 'ar' ? 'شروط الاستخدام' : 'Terms of Use'}</h2>
          <p style={{ marginBottom: 24 }}>{locale === 'ar' ? 'باستخدام منصة نوام شيب، فإنك توافق على الالتزام بهذه الشروط والأحكام.' : 'By using the NwamCheap platform, you agree to comply with these terms and conditions.'}</p>
          <h2 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>{locale === 'ar' ? 'سياسة الإرجاع' : 'Return Policy'}</h2>
          <p style={{ marginBottom: 24 }}>{locale === 'ar' ? 'يمكن إرجاع المنتجات خلال 7 أيام من الاستلام بشرط أن تكون بحالتها الأصلية.' : 'Products can be returned within 7 days of receipt, provided they are in their original condition.'}</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
