'use client';

export default function NotFound() {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <title>الصفحة غير موجودة | Page Not Found</title>
      </head>
      <body>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          backgroundColor: '#0a0a0a',
          color: '#ffffff',
          textAlign: 'center',
          padding: '20px'
        }}>
          <h1 style={{ fontSize: '3rem', margin: '0 0 10px 0', color: '#ff4d4f' }}>404</h1>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '500', margin: '0 0 20px 0' }}>عذراً، الصفحة غير موجودة</h2>
          <p style={{ color: '#888', margin: '0 0 30px 0' }}>The page you are looking for does not exist.</p>
          <a href="/ar" style={{
            backgroundColor: '#ffffff',
            color: '#000000',
            padding: '10px 24px',
            borderRadius: '6px',
            textDecoration: 'none',
            fontWeight: 'bold',
            transition: 'opacity 0.2s'
          }}>
            العودة للرئيسية / Back Home
          </a>
        </div>
      </body>
    </html>
  );
}
