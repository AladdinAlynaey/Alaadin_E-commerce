'use client';

import { useLocale } from 'next-intl';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useState } from 'react';

export default function ContactPage() {
  const locale = useLocale();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSent(true); };

  return (
    <>
      <Header />
      <main className="container section page-enter" style={{ maxWidth: 640, margin: '0 auto' }}>
        <h1 className="section-title">{locale === 'ar' ? 'اتصل بنا' : 'Contact Us'}</h1>
        {sent ? (
          <div className="card" style={{ padding: 48, textAlign: 'center' }}>
            <span style={{ fontSize: 48, display: 'block', marginBottom: 16 }}>✓</span>
            <h2 style={{ fontWeight: 700 }}>{locale === 'ar' ? 'تم إرسال رسالتك!' : 'Message sent!'}</h2>
          </div>
        ) : (
          <form className="card" style={{ padding: 32 }} onSubmit={handleSubmit}>
            <div className="input-group" style={{ marginBottom: 16 }}>
              <label>{locale === 'ar' ? 'الاسم' : 'Name'}</label>
              <input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="input-group" style={{ marginBottom: 16 }}>
              <label>{locale === 'ar' ? 'البريد الإلكتروني' : 'Email'}</label>
              <input type="email" className="input" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="input-group" style={{ marginBottom: 16 }}>
              <label>{locale === 'ar' ? 'الرسالة' : 'Message'}</label>
              <textarea className="input" rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required />
            </div>
            <button type="submit" className="btn btn-primary btn-full btn-lg">{locale === 'ar' ? 'إرسال' : 'Send'}</button>
          </form>
        )}
        <div style={{ textAlign: 'center', marginTop: 32, color: 'var(--text-secondary)' }}>
          <p>📧 support@shop.greatapps.online </p>
          <p>📱 +967 XXX XXX XXX</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
