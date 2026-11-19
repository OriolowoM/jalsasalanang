import type { Metadata } from 'next';
import ProgrammeClient from './ProgrammeClient';

export const metadata: Metadata = {
  title: 'Official Programme of Events — 72nd Jalsa Salana Nigeria 2026',
  description:
    'Full 3-day programme of events for the 72nd Jalsa Salana Nigeria (18th–20th December 2026) at Jamia Ahmadiyya Ilaro, Ogun State. Theme: "Observing Justice and Human Rights: The foundation for true Global Peace". Keynotes, speeches, Yoruba & Hausa translations, prayers, and sound of Jalsa.',
  alternates: {
    canonical: 'https://jalsasalana.ng/programme-of-events-jalsa-salana-nigeria-2026',
  },
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: 'https://jalsasalana.ng/programme-of-events-jalsa-salana-nigeria-2026',
    siteName: 'Jalsa Salana Nigeria',
    title: '72nd Jalsa Salana Nigeria 2026 — Official Programme of Events',
    description:
      'Explore the verified 3-day schedule (18th–20th Dec 2026) with keynote addresses, live translations, congregational prayers, and official Sound of Jalsa audio at Jamia Ahmadiyya Ilaro.',
    images: [
      {
        url: 'https://jalsasalana.ng/images/og-share-jalsa.jpg',
        secureUrl: 'https://jalsasalana.ng/images/og-share-jalsa.jpg',
        width: 1200,
        height: 630,
        type: 'image/jpeg',
        alt: '72nd Jalsa Salana Nigeria 2026 Programme of Events — Jamia Ahmadiyya Ilaro',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@Ahmadiyya_NG',
    creator: '@Ahmadiyya_NG',
    title: '72nd Jalsa Salana Nigeria 2026 — Official Programme of Events',
    description:
      'Full 3-day schedule, keynote speeches, Yoruba & Hausa translations, and communal meals at Jamia Ahmadiyya Ilaro (18th–20th Dec 2026).',
    images: ['https://jalsasalana.ng/images/og-share-jalsa.jpg'],
  },
};

export default function ProgrammePage() {
  return <ProgrammeClient />;
}
