import type { Metadata } from 'next';

export const SITE_URL = 'https://jalsasalana.ng';
export const DEFAULT_OG_IMAGE = 'https://jalsasalana.ng/images/og-share-jalsa.jpg';

export interface MetadataOptions {
  title: string;
  description: string;
  path?: string;
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  author?: string;
  noIndex?: boolean;
}

export function constructMetadata({
  title,
  description,
  path = '',
  image = DEFAULT_OG_IMAGE,
  type = 'website',
  publishedTime,
  author,
  noIndex = false,
}: MetadataOptions): Metadata {
  const cleanPath = path ? (path.startsWith('/') ? path : `/${path}`) : '';
  const url = `${SITE_URL}${cleanPath}`;

  const cleanImage = image || DEFAULT_OG_IMAGE;
  const imageUrl = cleanImage.startsWith('http')
    ? cleanImage
    : `${SITE_URL}${cleanImage.startsWith('/') ? '' : '/'}${cleanImage}`;

  const isPng = imageUrl.toLowerCase().endsWith('.png');
  const mimeType = isPng ? 'image/png' : 'image/jpeg';

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Jalsa Salana Nigeria',
      locale: 'en_NG',
      type,
      ...(publishedTime ? { publishedTime } : {}),
      ...(author ? { authors: [author] } : {}),
      images: [
        {
          url: imageUrl,
          secureUrl: imageUrl,
          width: 1200,
          height: 630,
          type: mimeType,
          alt: `${title} — Jalsa Salana Nigeria`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@Ahmadiyya_NG',
      creator: '@Ahmadiyya_NG',
      title,
      description,
      images: [imageUrl],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
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
}
