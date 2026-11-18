import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/login', '/_next/'],
      },
    ],
    sitemap: 'https://jalsasalana.ng/sitemap.xml',
    host: 'https://jalsasalana.ng',
  };
}
