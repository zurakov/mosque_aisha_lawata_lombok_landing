import type { Metadata } from 'next';
import './admin.css';

export const metadata: Metadata = {
  title: 'Admin — Masjid Aisyah Lawata',
  robots: { index: false, follow: false },
};

// Admin area renders its own html shell (the root layout is a pass-through and
// the localized site shell lives under app/[locale]). Kept deliberately simple
// and self-contained so content modules (schedule now; donation/gallery later)
// can be added as sibling pages without touching the public site.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
