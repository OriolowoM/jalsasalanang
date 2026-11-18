import type { Metadata } from 'next';
import '../styles/globals.css';

const SITE_URL = 'https://jalsasalana.ng';
const OG_IMAGE_URL = 'https://jalsasalana.ng/images/og-share-jalsa.jpg';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Jalsa Salana Nigeria — Official Digital Platform & Event Hub',
    template: '%s | Jalsa Salana Nigeria',
  },
  description:
    'Official digital platform of Jalsa Salana Nigeria. 72nd Annual Convention convening December 18–20, 2026 at Jamia Ahmadiyya Ilaro, Ogun State. Pre-registration, programme, speeches, live crowd map, and editorial publication.',
  keywords: [
    'Jalsa Salana Nigeria',
    'Jalsa Salana 2026',
    'Ahmadiyya Nigeria',
    '72nd Jalsa Salana',
    'Jamia Ahmadiyya Ilaro',
    'Alatoye Folorunso Azeez',
    'Islamic Convention Nigeria',
    'Love for All Hatred for None',
    'Justice and Equality',
  ],
  authors: [{ name: "Ahmadiyya Muslim Jama'at Nigeria", url: SITE_URL }],
  creator: "Ahmadiyya Muslim Jama'at Nigeria",
  publisher: "Ahmadiyya Muslim Jama'at Nigeria",
  applicationName: 'Jalsa Salana Nigeria',
  alternates: {
    canonical: SITE_URL,
  },
  icons: {
    icon: [
      { url: '/images/jalsa-emblem.png', sizes: '192x192', type: 'image/png' },
      { url: '/images/jalsa-crest.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/images/jalsa-emblem.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/images/jalsa-emblem.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_NG',
    url: SITE_URL,
    siteName: 'Jalsa Salana Nigeria',
    title: 'Jalsa Salana Nigeria — Official Digital Platform & Event Hub',
    description:
      'Official digital platform of Jalsa Salana Nigeria. 72nd Annual Convention convening December 18–20, 2026 at Jamia Ahmadiyya Ilaro, Ogun State. Verified passes, keynote speeches, schedule, and live updates.',
    images: [
      {
        url: OG_IMAGE_URL,
        secureUrl: OG_IMAGE_URL,
        width: 1200,
        height: 630,
        type: 'image/jpeg',
        alt: '72nd Jalsa Salana Nigeria Official Platform — Jamia Ahmadiyya Ilaro',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@Ahmadiyya_NG',
    creator: '@Ahmadiyya_NG',
    title: 'Jalsa Salana Nigeria — Official Digital Platform & Event Hub',
    description:
      'Official digital platform of Jalsa Salana Nigeria. 72nd Annual Convention: December 18–20, 2026 at Jamia Ahmadiyya Ilaro. Pre-registration, speeches, and live updates.',
    images: [OG_IMAGE_URL],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: "Ahmadiyya Muslim Jama'at Nigeria",
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/images/jalsa-emblem.png`,
        width: 512,
        height: 512,
      },
      sameAs: [
        'https://twitter.com/Ahmadiyya_NG',
        'https://www.facebook.com/AhmadiyyaNigeria',
        'https://www.youtube.com/@AhmadiyyaNigeria',
      ],
      slogan: 'Love for All, Hatred for None',
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: 'Jalsa Salana Nigeria',
      publisher: { '@id': `${SITE_URL}/#organization` },
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_URL}/blog?search={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'Event',
      '@id': `${SITE_URL}/#event-2026`,
      name: '72nd Jalsa Salana Nigeria 2026',
      description:
        'The 72nd Annual National Convention of Ahmadiyya Muslim Jama\'at Nigeria convening under the theme: "Justice and Equality: Indispensable Prerequisites for Global Peace and National Harmony".',
      startDate: '2026-12-18T09:00:00+01:00',
      endDate: '2026-12-20T17:00:00+01:00',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      eventStatus: 'https://schema.org/EventScheduled',
      location: {
        '@type': 'Place',
        name: 'Jamia Ahmadiyya Ilaro Grounds',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Ilaro',
          addressRegion: 'Ogun State',
          addressCountry: 'NG',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 6.8872,
          longitude: 3.0142,
        },
      },
      image: [OG_IMAGE_URL],
      organizer: { '@id': `${SITE_URL}/#organization` },
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'NGN',
        availability: 'https://schema.org/InStock',
        url: `${SITE_URL}/registration`,
        validFrom: '2026-01-01T00:00:00+01:00',
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* WhatsApp & Social Media Preview Tag Fallbacks */}
        <meta property="og:image" content={OG_IMAGE_URL} />
        <meta property="og:image:secure_url" content={OG_IMAGE_URL} />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="72nd Jalsa Salana Nigeria Official Platform" />
        <meta name="twitter:image" content={OG_IMAGE_URL} />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="image_src" href={OG_IMAGE_URL} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-surface-bg text-ink font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
