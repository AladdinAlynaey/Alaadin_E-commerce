'use client';

import { useLocale } from 'next-intl';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function AboutPage() {
  const locale = useLocale();

  return (
    <>
      <Header />
      <main className="container section page-enter" style={{ maxWidth: 800, margin: '0 auto' }}>
        <h1 className="section-title">{locale === 'ar' ? 'من نحن' : 'About Us'}</h1>
        <div className="card" style={{ padding: 32 }}>
          <p style={{ lineHeight: 2, color: 'var(--text-secondary)', marginBottom: 24 }}>
            {locale === 'ar'
              ? 'نوام شيب هي منصة تسوق إلكترونية رائدة في اليمن، تهدف إلى تقديم أفضل الملابس والأزياء بأسعار مناسبة. نحن نؤمن بأن كل شخص يستحق أن يبدو بأفضل حال، ولذلك نقدم تشكيلة واسعة من المنتجات عالية الجودة.'
              : 'NwamCheap is a leading e-commerce platform in Yemen, dedicated to offering the best clothing and fashion at affordable prices. We believe everyone deserves to look their best, which is why we offer a wide selection of high-quality products.'}
          </p>
          <div className="grid grid-3" style={{ gap: 24 }}>
            {[
              { icon: '🚚', title: locale === 'ar' ? 'توصيل سريع' : 'Fast Delivery', desc: locale === 'ar' ? 'توصيل لجميع المحافظات' : 'Delivery to all governorates' },
              { icon: '💳', title: locale === 'ar' ? 'دفع آمن' : 'Secure Payment', desc: locale === 'ar' ? 'طرق دفع متعددة وآمنة' : 'Multiple secure payment methods' },
              { icon: '↩️', title: locale === 'ar' ? 'إرجاع سهل' : 'Easy Returns', desc: locale === 'ar' ? 'سياسة إرجاع مرنة' : 'Flexible return policy' },
            ].map(item => (
              <div key={item.title} style={{ textAlign: 'center' }}>
                <span style={{ fontSize: 32, display: 'block', marginBottom: 8 }}>{item.icon}</span>
                <h3 style={{ fontWeight: 700, marginBottom: 4 }}>{item.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
