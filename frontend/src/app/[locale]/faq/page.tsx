'use client';

import { useLocale } from 'next-intl';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function FAQPage() {
  const locale = useLocale();
  const faqs = locale === 'ar' ? [
    { q: 'كيف أطلب من نوام شيب؟', a: 'ابحث عن المنتج المطلوب، أضفه إلى السلة، ثم أتم عملية الشراء وأرسل إثبات الدفع.' },
    { q: 'ما هي طرق الدفع المتاحة؟', a: 'نقبل التحويل البنكي والمحافظ الإلكترونية. بعد التحويل، قم برفع صورة إثبات الدفع.' },
    { q: 'كم تستغرق عملية التوصيل؟', a: 'صنعاء: 1-2 أيام. عدن: 2-4 أيام. باقي المحافظات: 3-5 أيام.' },
    { q: 'هل يمكنني إرجاع المنتج؟', a: 'نعم، يمكن الإرجاع خلال 7 أيام من الاستلام بشرط أن يكون المنتج بحالته الأصلية.' },
  ] : [
    { q: 'How do I order from NwamCheap?', a: 'Find the product you want, add it to cart, complete the checkout, and upload your payment proof.' },
    { q: 'What payment methods are available?', a: 'We accept bank transfers and e-wallets. After transfer, upload a photo of the payment proof.' },
    { q: 'How long does delivery take?', a: 'Sanaa: 1-2 days. Aden: 2-4 days. Other: 3-5 days.' },
    { q: 'Can I return a product?', a: 'Yes, returns are accepted within 7 days of receipt if the product is in its original condition.' },
  ];

  return (
    <>
      <Header />
      <main className="container section page-enter" style={{ maxWidth: 800, margin: '0 auto' }}>
        <h1 className="section-title">{locale === 'ar' ? 'الأسئلة الشائعة' : 'FAQ'}</h1>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {faqs.map((faq, i) => (
            <div key={i} className="card" style={{ padding: 24 }}>
              <h3 style={{ fontWeight: 700, marginBottom: 8 }}>{faq.q}</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>{faq.a}</p>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
