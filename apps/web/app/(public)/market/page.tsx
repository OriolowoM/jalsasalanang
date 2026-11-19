import type { Metadata } from 'next';
import MarketClient from './MarketClient';

export const metadata: Metadata = {
  title: 'Jalsa Salana 2026 Market — Booking & Vendor Guidelines',
  description:
    'Official guidelines, commercial stall pricing, operating hours, and registration instructions for the 72nd Jalsa Salana Nigeria 2026 Market at Jamia Ahmadiyya Ilaro, Ogun State.',
  alternates: {
    canonical: 'https://jalsasalana.ng/market',
  },
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: 'https://jalsasalana.ng/market',
    siteName: 'Jalsa Salana Nigeria',
    title: 'Jalsa Salana 2026 Market — Commercial Stalls & Guidelines',
    description:
      'Book official commercial stalls and review trade guidelines for the 72nd Jalsa Salana Nigeria 2026 convening 18th–20th December 2026 at Jamia Ahmadiyya Ilaro.',
    images: [
      {
        url: 'https://jalsasalana.ng/images/og-share-jalsa.jpg',
        secureUrl: 'https://jalsasalana.ng/images/og-share-jalsa.jpg',
        width: 1200,
        height: 630,
        type: 'image/jpeg',
        alt: 'Jalsa Salana 2026 Market & Vendor Guidelines — Jamia Ahmadiyya Ilaro',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@Ahmadiyya_NG',
    creator: '@Ahmadiyya_NG',
    title: 'Jalsa Salana 2026 Market — Commercial Stalls & Guidelines',
    description:
      'Book official commercial stalls and review trade guidelines for the 72nd Jalsa Salana Nigeria 2026 at Jamia Ahmadiyya Ilaro.',
    images: ['https://jalsasalana.ng/images/og-share-jalsa.jpg'],
  },
};

export default function MarketPage() {
  return <MarketClient />;
}
