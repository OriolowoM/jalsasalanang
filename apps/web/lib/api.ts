const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export async function fetchApi<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const res = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || `Request failed with status ${res.status}`);
  }

  return data;
}

// Articles API
export async function getArticles(params: Record<string, string | number> = {}) {
  const query = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== '') query.append(k, String(v));
  }
  return fetchApi(`/articles?${query.toString()}`);
}

export async function getArticleBySlug(slug: string) {
  return fetchApi(`/articles/${slug}`);
}

// Editions API
export async function getEditions() {
  return fetchApi('/editions');
}

export async function getCurrentEdition() {
  return fetchApi('/editions/current');
}

export async function getEditionByYear(year: string | number) {
  return fetchApi(`/editions/${year}`);
}

// Speeches API
export async function getSpeeches(params: Record<string, string | number> = {}) {
  const query = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== '') query.append(k, String(v));
  }
  return fetchApi(`/speeches?${query.toString()}`);
}

export async function getSpeechBySlug(slug: string) {
  return fetchApi(`/speeches/${slug}`);
}

// Galleries API
export async function getGalleries() {
  return fetchApi('/galleries');
}

export async function getGalleryBySlug(slug: string) {
  return fetchApi(`/galleries/${slug}`);
}

// Categories API
export async function getCategories() {
  return fetchApi('/categories');
}

export async function getCategoryBySlug(slug: string) {
  return fetchApi(`/categories/${slug}`);
}

// Settings API
export async function getSiteSettings() {
  return fetchApi('/settings');
}

// Search API
export async function searchContent(q: string) {
  return fetchApi(`/search?q=${encodeURIComponent(q)}`);
}

// Newsletter
export async function subscribeNewsletter(email: string, fullName?: string, websiteHp?: string) {
  return fetchApi('/newsletter/subscribe', {
    method: 'POST',
    body: JSON.stringify({ email, fullName, websiteHp }),
  });
}
