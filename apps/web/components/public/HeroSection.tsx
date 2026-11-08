import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, User, ArrowUpRight } from 'lucide-react';

interface Props {
  heroArticle?: any;
  secondaryArticles?: any[];
}

export default function HeroSection({ heroArticle, secondaryArticles = [] }: Props) {
  if (!heroArticle && secondaryArticles.length === 0) return null;

  return (
    <section className="py-6 sm:py-8 lg:py-10 border-b border-surface-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Main Hero Story (Left Column: 7 Cols) */}
          {heroArticle && (
            <div className="lg:col-span-7 flex flex-col justify-between group">
              <Link href={`/articles/${heroArticle.slug}`} className="block overflow-hidden rounded-xl mb-4 relative aspect-[16/10] bg-gray-100 shadow-sm">
                <Image
                  src={heroArticle.featuredImage || '/images/70th-jalsa-hero.jpg'}
                  alt={heroArticle.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                {/* Overlay Badge & Credit */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-primary text-white text-[11px] font-bold uppercase tracking-wider shadow">
                    {heroArticle.categories?.[0]?.name || 'Cover Story'}
                  </span>
                  {heroArticle.edition && (
                    <span className="px-2.5 py-1 rounded-full bg-gold/90 text-primary-dark text-[10px] font-extrabold uppercase tracking-wider shadow">
                      {heroArticle.edition.editionNumber || heroArticle.edition.year}
                    </span>
                  )}
                </div>

                {heroArticle.imageCredit && (
                  <div className="absolute bottom-3 right-3 text-[10px] text-gray-300 bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
                    {heroArticle.imageCredit}
                  </div>
                )}
              </Link>

              <div>
                <Link href={`/articles/${heroArticle.slug}`}>
                  <h1 className="font-serif font-bold text-2xl sm:text-3xl lg:text-4xl text-charcoal-heading group-hover:text-primary transition-colors leading-[1.2] mb-3">
                    {heroArticle.title}
                  </h1>
                </Link>

                {heroArticle.subtitle && (
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4 line-clamp-3">
                    {heroArticle.subtitle}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-4 text-xs text-charcoal-muted border-t border-gray-100 pt-3">
                  <div className="flex items-center gap-1.5 font-medium text-charcoal">
                    <User className="w-3.5 h-3.5 text-primary" />
                    <span>{heroArticle.author?.name || 'Editorial Board'}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-gold-dark" />
                    <span>{heroArticle.readingTime || 5} min read</span>
                  </div>
                  <span>•</span>
                  <time className="text-gray-400">
                    {heroArticle.publishedAt
                      ? new Date(heroArticle.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                      : 'October 2026'}
                  </time>
                </div>
              </div>
            </div>
          )}

          {/* Secondary Featured Stories (Right Column: 5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between divide-y divide-gray-200">
            <div className="mb-2 pb-2 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xs font-extrabold tracking-widest uppercase text-primary">
                Featured Highlights
              </h2>
              <Link href="/articles" className="text-xs font-semibold text-gold-dark hover:text-primary flex items-center gap-0.5">
                All Stories <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {secondaryArticles.slice(0, 3).map((article: any, index: number) => (
              <article key={article.id || index} className="py-4 first:pt-2 last:pb-0 group">
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-8">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                        {article.categories?.[0]?.name || 'Editorial'}
                      </span>
                    </div>

                    <Link href={`/articles/${article.slug}`}>
                      <h3 className="font-serif font-bold text-sm sm:text-base text-charcoal group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                        {article.title}
                      </h3>
                    </Link>

                    {article.subtitle && (
                      <p className="text-xs text-gray-500 line-clamp-1 mt-1">
                        {article.subtitle}
                      </p>
                    )}

                    <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-2">
                      <span className="font-medium text-gray-700">{article.author?.name}</span>
                      <span>•</span>
                      <span>{article.readingTime || 4} min read</span>
                    </div>
                  </div>

                  <div className="col-span-4">
                    <Link href={`/articles/${article.slug}`} className="block relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 shadow-sm">
                      <Image
                        src={article.featuredImage || '/images/jalsa-convention-a.jpg'}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
