import type { Metadata } from 'next';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Jalsa Salana Nigeria — Digital Editorial & Publishing Platform',
    template: '%s | Jalsa Salana Nigeria',
  },
  description: 'Official digital editorial publication of Jalsa Salana Nigeria documenting spiritual enlightenment, intellectual discourse, historical conventions, and community leadership.',
  keywords: ['Jalsa Salana Nigeria', 'Ahmadiyya Nigeria', 'Islamic Convention', 'Review of Religions', 'Peace', 'Justice', 'Khilafat'],
  authors: [{ name: 'Ahmadiyya Muslim Jama\'at Nigeria' }],
  icons: {
    icon: '/images/jalsa-emblem.png',
    apple: '/images/jalsa-emblem.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: 'https://jalsasalana.ng',
    siteName: 'Jalsa Salana Nigeria',
    images: [{ url: '/images/jalsa-emblem.png', width: 512, height: 512 }, { url: '/images/jalsa72-logo.jpg', width: 700, height: 320 }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-surface-bg text-charcoal">
        {children}
      </body>
    </html>
  );
}
