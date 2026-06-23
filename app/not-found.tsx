import Link from 'next/link';

// Global not-found. Renders its own html shell since the root layout is a
// pass-through (the localized layout owns the main <html>).
export default function NotFound() {
  return (
    <html lang="id">
      <body
        style={{
          fontFamily: 'system-ui, sans-serif',
          display: 'flex',
          minHeight: '100vh',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#F7F5F0',
          color: '#0B3B36',
          margin: 0,
        }}
      >
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h1 style={{ fontSize: '3rem', margin: 0 }}>404</h1>
          <p style={{ marginTop: '0.5rem' }}>Halaman tidak ditemukan / Page not found.</p>
          <Link
            href="/id"
            style={{
              display: 'inline-block',
              marginTop: '1.5rem',
              padding: '0.6rem 1.5rem',
              borderRadius: '9999px',
              background: '#0B3B36',
              color: '#fff',
              textDecoration: 'none',
            }}
          >
            Beranda / Home
          </Link>
        </div>
      </body>
    </html>
  );
}
