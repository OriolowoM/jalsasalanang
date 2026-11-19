import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getArticles, getCategories } from '@/lib/api';
import { Clock, Filter, ArrowRight, BookOpen, Search, Calendar, User } from 'lucide-react';
import { getArticleFeaturedImage } from '@/lib/article-images';

export const metadata = {
  title: 'Blog — Jalsa Salana Nigeria Official Blog & Dispatches',
  description: 'Official blog of Jalsa Salana Nigeria featuring thought-provoking articles, keynote convention lectures, Amir’s Corner, spiritual treatises, and press releases.',
};

interface BlogPageProps {
  searchParams: Promise<{ page?: string; category?: string; edition?: string; search?: string }>;
}

export default async function BlogPage(props: BlogPageProps) {
  const resolvedSearchParams = await props.searchParams;
  const page = parseInt(resolvedSearchParams?.page || '1', 10);
  const category = resolvedSearchParams?.category || '';
  const edition = resolvedSearchParams?.edition || '';
  const search = resolvedSearchParams?.search || '';

  const [articlesRes, categoriesRes] = await Promise.all([
    getArticles({ page, limit: 12, category, edition, search }).catch(() => ({ data: [], pagination: { total: 0, totalPages: 1 } })),
    getCategories().catch(() => ({ data: [] })),
  ]);

  const articles = articlesRes.data || [];
  const pagination = articlesRes.pagination || { total: 0, totalPages: 1, page: 1 };
  const categories = categoriesRes.data || [];

  return (
    <div className="py-12 sm:py-20 bg-surface-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Blog Header with Jalsa Theme Branding */}
        <div className="pb-8 mb-10 border-b border-teal/20 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 text-teal text-xs font-display font-bold uppercase tracking-widest mb-3 border border-teal-200">
              <BookOpen className="w-3.5 h-3.5 text-teal" />
              <span>Official Blog &amp; Dispatches</span>
            </div>
            <h1 className="font-display font-extrabold text-display-lg text-forest leading-tight">
              Jalsa Salana Nigeria Blog
            </h1>
            <p className="text-base text-ink-muted font-sans mt-3 leading-relaxed">
              Spiritual enlightenment, addresses by Amir Sahib, convention research papers, reflections, and official press reports — documented in chronological order.
            </p>
          </div>

          <div className="text-xs text-ink-muted font-medium bg-white px-4 py-2.5 rounded-2xl border border-surface-border/60 shadow-soft flex-shrink-0">
            Total Articles: <strong className="text-forest font-bold">{pagination.total} published posts</strong>
          </div>
        </div>

        {/* Category Filters Bar */}
        <div className="bg-white p-5 rounded-3xl border border-surface-border/60 shadow-soft mb-12 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-display font-bold uppercase text-ink-muted flex items-center gap-1.5 mr-1">
              <Filter className="w-3.5 h-3.5 text-teal" /> Filter by Category:
            </span>

            <Link
              href="/blog"
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                !category && !edition ? 'bg-teal text-white shadow-soft' : 'bg-surface-muted text-ink-muted hover:bg-surface-bg hover:text-forest'
              }`}
            >
              All Blog Posts
            </Link>

            {categories.map((cat: any) => (
              <Link
                key={cat.id}
                href={`/blog?category=${cat.slug}`}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  category === cat.slug ? 'bg-teal text-white shadow-soft' : 'bg-surface-muted text-ink-muted hover:bg-surface-bg hover:text-forest'
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </div>

          <div className="text-xs text-ink-muted font-medium flex-shrink-0">
            Showing <strong className="text-forest font-bold">{articles.length}</strong> of {pagination.total} articles (descending)
          </div>
        </div>

        {/* Blog Articles Grid (Descending order with authentic images) */}
        {articles.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-4xl border border-surface-border/60 p-10 shadow-soft">
            <BookOpen className="w-10 h-10 text-teal mx-auto mb-3" />
            <h3 className="font-display font-bold text-lg text-forest">No blog articles matched your filter</h3>
            <p className="text-xs text-ink-muted font-sans mt-1">Try resetting the category filter or searching for another keyword.</p>
            <Link href="/blog" className="inline-block mt-4 text-xs font-bold text-teal hover:underline">
              Reset Filters &rarr;
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article: any, idx: number) => {
              const primaryCategory = article.categories?.[0]?.name || 'Editorial';
              const readTime = article.readingTime || 4;
              const featuredImage = getArticleFeaturedImage(article, idx);

              return (
                <article
                  key={article.id}
                  className={`bg-white rounded-3xl overflow-hidden border border-surface-border/60 shadow-soft flex flex-col justify-between group hover:shadow-soft-lg transition-all duration-300 hover:border-teal/30 hover:-translate-y-1 ${
                    idx % 3 === 1 ? 'lg:translate-y-2' : ''
                  }`}
                >
                  <div>
                    {/* Featured Image with category badge */}
                    <Link href={`/blog/${article.slug}`} className="block relative aspect-[16/10] bg-surface-muted overflow-hidden">
                      <Image
                        src={featuredImage}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        priority={idx < 3}
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/95 text-forest shadow-sm backdrop-blur-sm">
                          {primaryCategory}
                        </span>
                      </div>
                    </Link>

                    {/* Article Content */}
                    <div className="p-6 sm:p-7">
                      <div className="flex items-center gap-3 text-xs text-ink-muted mb-3 font-sans">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-teal" />
                          {readTime} min read
                        </span>
                        {article.publishedAt && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3 text-ink-muted" />
                              {new Date(article.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                          </>
                        )}
                      </div>

                      <h2 className="font-display font-bold text-lg sm:text-xl text-forest group-hover:text-teal leading-snug line-clamp-2 transition-colors">
                        <Link href={`/blog/${article.slug}`}>
                          {article.title}
                        </Link>
                      </h2>

                      {article.excerpt && (
                        <p className="mt-2.5 text-xs sm:text-sm text-ink-muted font-sans line-clamp-3 leading-relaxed">
                          {article.excerpt}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-6 sm:px-7 pb-6 pt-4 border-t border-surface-border/40 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-teal-50 text-teal flex items-center justify-center text-[10px] font-bold">
                        {article.author?.name ? article.author.name.charAt(0) : 'E'}
                      </div>
                      <span className="text-xs font-semibold text-ink-body truncate max-w-[130px]">
                        {article.author?.name || 'Editorial Board'}
                      </span>
                    </div>

                    <Link
                      href={`/blog/${article.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-teal group-hover:text-forest transition-colors"
                    >
                      <span>Read Article</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Pagination Controls */}
        {pagination.totalPages > 1 && (
          <div className="mt-16 flex items-center justify-center gap-2">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => {
              const isCurrent = p === pagination.page;
              return (
                <Link
                  key={p}
                  href={`/blog?page=${p}${category ? `&category=${category}` : ''}${edition ? `&edition=${edition}` : ''}`}
                  className={`w-11 h-11 rounded-2xl font-bold text-xs flex items-center justify-center transition-all ${
                    isCurrent
                      ? 'bg-teal text-white shadow-soft'
                      : 'bg-white border border-surface-border/60 text-ink-heading hover:border-teal/40 hover:text-teal'
                  }`}
                >
                  {p}
                </Link>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
