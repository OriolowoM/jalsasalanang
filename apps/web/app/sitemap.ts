import { MetadataRoute } from 'next';

const BASE_URL = 'https://jalsasalana.ng';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static core routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/registration`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/dashboard`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/live-crowd`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/editions`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/editions/2026`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/editions/2025`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/editions/2024`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/speeches`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/galleries`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/editorial-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ];

  // Dynamic published article slugs (if DB / API reachable)
  try {
    const apiUrl = process.env.INTERNAL_API_URL || `${BASE_URL}/api/v1`;
    const res = await fetch(`${apiUrl}/articles?limit=100`, { next: { revalidate: 3600 } }).catch(() => null);
    if (res && res.ok) {
      const data = await res.json();
      if (data?.data && Array.isArray(data.data)) {
        const articleEntries: MetadataRoute.Sitemap = data.data.map((art: any) => ({
          url: `${BASE_URL}/articles/${art.slug}`,
          lastModified: art.updatedAt ? new Date(art.updatedAt) : new Date(),
          changeFrequency: 'monthly',
          priority: 0.8,
        }));
        return [...staticRoutes, ...articleEntries];
      }
    }
  } catch (_) {
    // If during static build or offline, static routes provide full coverage
  }

  return staticRoutes;
}
