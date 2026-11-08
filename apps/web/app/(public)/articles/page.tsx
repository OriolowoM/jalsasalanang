import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getArticles, getCategories, getEditions } from '@/lib/api';
import { Clock, Calendar, User, Filter, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Articles, Research & Feature Stories',
  description: 'Explore thought-provoking editorial articles, historical retrospectives, theological treatises, and press releases from Jalsa Salana Nigeria.',
};

export default async function ArticlesListingPage({
  searchParams,
}: {
  searchParams: { page?: string; category?: string; edition?: string; search?: string };
}) {
  const page = parseInt(searchParams.page || '1', 10);
  const category = searchParams.category || '';
  const edition = searchParams.edition || '';
  const search = searchParams.search || '';

  const [articlesRes, categoriesRes, editionsRes] = await Promise.all([
    getArticles({ page, limit: 12, category, edition, search }).catch(() => ({ data: [], pagination: { total: 0, totalPages: 1 } })),
    getCategories().catch(() => ({ data: [] })),
    getEditions().catch(() => ({ data: [] })),
  ]);

  const articles = articlesRes.data || [];
  const pagination = articlesRes.pagination || { total: 0, totalPages: 1, page: 1 };
  const categories = categoriesRes.data || [];
  const editions = editionsRes.data || [];

  return (
    <div className="py-8 sm:py-12 bg-surface-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="pb-6 mb-8 border-b-2 border-primary">
          <span className="text-xs font-extrabold uppercase tracking-widest text-gold-dark block mb-1">
            Publication Index
          </span>
          <h1 className="font-serif font-black text-3xl sm:text-4xl text-charcoal-heading">
            Articles, Research &amp; Features
          </h1>
          <p className="text-sm text-gray-600 mt-2 max-w-2xl">
            Intellectual discussions, spiritual enlightenment, historical perspectives, and official press reports from the Ahmadiyya Muslim Jama&apos;at Nigeria.
          </p>
        </div>

        {/* Filters Bar */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase text-gray-400 flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>

            <Link
              href="/articles"
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                !category && !edition ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Topics
            </Link>

            {categories.slice(0, 5).map((cat: any) => (
              <Link
                key={cat.id}
                href={`/articles?category=${cat.slug}`}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  category === cat.slug ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>

          <div className="text-xs text-gray-500 font-medium">
            Showing {articles.length} of {pagination.total} published articles
          </div>
        </div>

        {/* Articles Grid */}
        {articles.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-xl border border-gray-200">
            <h3 className="font-serif font-bold text-lg text-charcoal">No articles matched your criteria</h3>
            <p className="text-xs text-gray-500 mt-1">Try resetting the category filter or searching for another topic.</p>
            <Link href="/articles" className="inline-block mt-4 text-xs font-bold text-primary hover:underline">
              Reset Filters &rarr;
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article: any) => (
              <article
                key={article.id}
                className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm flex flex-col justify-between group hover:shadow-md transition-all"
              >
                <div>
                  <Link href={`/articles/${article.slug}`} className="block relative aspect-[16/10] bg-gray-100 overflow-hidden">
                    <Image
                      src={article.featuredImage || '/images/jalsa-convention-a.jpg'}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-primary text-white text-[10px] font-bold uppercase tracking-wider">
                        {article.categories?.[0]?.name || 'Article'}
                      </span>
                      {article.edition && (
                        <span className="px-2 py-0.5 rounded-full bg-gold/90 text-primary-dark text-[10px] font-extrabold uppercase">
                          {article.edition.year}
                        </span>
                      )}
                    </div>
                  </Link>

                  <div className="p-5">
                    <Link href={`/articles/${article.slug}`}>
                      <h2 className="font-serif font-bold text-lg text-charcoal group-hover:text-primary transition-colors leading-snug mb-2 line-clamp-2">
                        {article.title}
                      </h2>
                    </Link>

                    {article.subtitle && (
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-4">
                        {article.subtitle}
                      </p>
                    )}
                  </div>
                </div>

                <div className="px-5 pb-5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                  <span className="font-medium text-gray-700 truncate max-w-[150px]">
                    {article.author?.name}
                  </span>
                  <span className="flex items-center gap-1 flex-shrink-0">
                    <Clock className="w-3.5 h-3.5 text-gold-dark" />
                    {article.readingTime || 5} min read
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={`/articles?page=${p}${category ? `&category=${category}` : ''}${edition ? `&edition=${edition}` : ''}`}
                className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold transition-colors ${
                  pagination.page === p
                    ? 'bg-primary text-white shadow'
                    : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                {p}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
