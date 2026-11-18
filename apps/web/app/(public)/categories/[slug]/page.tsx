import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getCategoryBySlug, getArticles } from '@/lib/api';
import { Clock, Calendar, User, ChevronRight, BookOpen, ArrowRight } from 'lucide-react';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params;
  try {
    const res = await getCategoryBySlug(slug);
    const cat = res.data;
    if (!cat) return { title: 'Category Not Found — Jalsa Salana Nigeria' };

    return {
      title: `${cat.name} — Editorial Category — Jalsa Salana Nigeria`,
      description: cat.description || `Articles and essays on ${cat.name} from Jalsa Salana Nigeria.`,
    };
  } catch {
    return { title: 'Category — Jalsa Salana Nigeria' };
  }
}

export default async function CategoryDetailPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  let category: any;
  let articles: any[] = [];
  try {
    const [catRes, artRes] = await Promise.all([
      getCategoryBySlug(slug),
      getArticles({ category: slug, limit: 18 }),
    ]);
    category = catRes.data;
    articles = artRes.data || [];
  } catch {
    notFound();
  }

  if (!category) notFound();

  return (
    <div className="py-8 sm:py-12 bg-surface-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs text-charcoal-muted mb-6 font-medium">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <Link href="/articles" className="hover:text-primary transition-colors">Digital Magazine</Link>
          <ChevronRight className="w-3 h-3 text-gray-400" />
          <span className="text-primary font-bold">{category.name}</span>
        </nav>

        {/* Category Header Card */}
        <div className="p-8 sm:p-10 rounded-2xl bg-white border border-surface-border shadow-sm mb-10">
          <div 
            className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white mb-3 shadow-sm"
            style={{ backgroundColor: category.color || '#064e3b' }}
          >
            Editorial Column
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-primary mb-3">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-sm sm:text-base text-charcoal-muted max-w-3xl leading-relaxed font-serif">
              {category.description}
            </p>
          )}
        </div>

        {/* Articles in Category */}
        {articles.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-2xl border border-surface-border p-8">
            <BookOpen className="w-10 h-10 text-gold-dark mx-auto mb-3" />
            <h3 className="font-display font-bold text-lg text-primary">No articles published in this category yet</h3>
            <p className="text-xs text-charcoal-muted font-serif mt-1">Check back soon for new dispatches or explore our full library.</p>
            <Link href="/articles" className="inline-block mt-4 text-xs font-bold text-gold-dark hover:underline">
              Browse All Articles &rarr;
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {articles.map((article: any) => {
              const readTime = article.readingTime || 4;

              return (
                <article
                  key={article.id}
                  className="bg-white rounded-2xl overflow-hidden border border-surface-border shadow-sm flex flex-col justify-between group hover:shadow-prestige transition-all duration-300 hover:border-gold/40"
                >
                  <div>
                    <Link href={`/articles/${article.slug}`} className="block relative aspect-[16/10] bg-gray-100 overflow-hidden">
                      {article.featuredImage ? (
                        <Image
                          src={article.featuredImage}
                          alt={article.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-forest via-teal to-forest-950 flex flex-col items-center justify-center text-white p-4 text-center">
                          <span className="text-xs font-display font-extrabold uppercase tracking-widest text-lime mb-1">
                            Jalsa Salana Nigeria
                          </span>
                          <span className="text-[10px] font-sans uppercase tracking-wider text-white/70">
                            Official Archive
                          </span>
                        </div>
                      )}
                    </Link>

                    <div className="p-5 sm:p-6">
                      <div className="flex items-center gap-3 text-xs text-charcoal-muted mb-2 font-serif">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-gold-dark" />
                          {readTime} min read
                        </span>
                        {article.publishedAt && (
                          <>
                            <span>•</span>
                            <span>{new Date(article.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          </>
                        )}
                      </div>

                      <h2 className="font-display font-bold text-lg sm:text-xl text-primary group-hover:text-primary-dark leading-snug line-clamp-2">
                        <Link href={`/articles/${article.slug}`}>
                          {article.title}
                        </Link>
                      </h2>

                      {article.excerpt && (
                        <p className="mt-2 text-xs sm:text-sm text-charcoal-muted font-serif line-clamp-3 leading-relaxed">
                          {article.excerpt}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="px-5 sm:px-6 pb-5 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary-subtle text-primary flex items-center justify-center text-[10px] font-bold">
                        {article.author?.name ? article.author.name.charAt(0) : 'E'}
                      </div>
                      <span className="text-xs font-medium text-charcoal truncate max-w-[130px]">
                        {article.author?.name || 'Editorial Board'}
                      </span>
                    </div>

                    <Link
                      href={`/articles/${article.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-gold-dark group-hover:text-primary transition-colors"
                    >
                      <span>Read</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
