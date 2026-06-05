'use client';

import { useLocale } from 'next-intl';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function PrivacyPage() {
  const locale = useLocale();
  return (
    <>
      <Header />
      <main className="container section page-enter" style={{ maxWidth: 800, margin: '0 auto' }}>
        <h1 className="section-title">{locale === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}</h1>
        <div className="card" style={{ padding: 32, lineHeight: 2, color: 'var(--text-secondary)' }}>
          <h2 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>{locale === 'ar' ? 'جمع البيانات' : 'Data Collection'}</h2>
          <p style={{ marginBottom: 24 }}>{locale === 'ar' ? 'نحن نجمع المعلومات التي تقدمها لنا مباشرة عند إنشاء حساب أو تقديم طلب. تشمل هذه المعلومات الاسم والبريد الإلكتروني ورقم الهاتف وعنوان الشحن.' : 'We collect information you provide directly when creating an account or placing an order. This includes your name, email, phone number, and shipping address.'}</p>
          <h2 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>{locale === 'ar' ? 'استخدام البيانات' : 'Data Usage'}</h2>
          <p style={{ marginBottom: 24 }}>{locale === 'ar' ? 'نستخدم بياناتك لمعالجة الطلبات وتحسين تجربة التسوق وإرسال إشعارات مهمة حول طلباتك.' : 'We use your data to process orders, improve the shopping experience, and send important notifications about your orders.'}</p>
          <h2 style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>{locale === 'ar' ? 'حماية البيانات' : 'Data Protection'}</h2>
          <p>{locale === 'ar' ? 'نحن نتخذ إجراءات أمنية مناسبة لحماية معلوماتك الشخصية من الوصول غير المصرح به.' : 'We take appropriate security measures to protect your personal information from unauthorized access.'}</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
