import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, User, ArrowRight } from 'lucide-react';
import HeroCompanionBar from './HeroCompanionBar';

interface Props {
  heroArticle?: any;
  secondaryArticles?: any[];
}

export default function HeroSection({ heroArticle, secondaryArticles = [] }: Props) {
  if (!heroArticle && secondaryArticles.length === 0) return null;

  return (
    <section className="pt-6 sm:pt-14 pb-12 sm:pb-20 relative overflow-hidden">
      {/* Soft gradient mesh background — subtle, organic feel */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-lime-50 rounded-full blur-[120px] opacity-60 -mr-40 -mt-20" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-50 rounded-full blur-[100px] opacity-40 -ml-32 -mb-32" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Asymmetrical grid: hero image deliberately larger, overlapping */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-0 items-start">

          {/* ── Main Story: Left 8 cols, image slightly bleeds right ── */}
          {heroArticle && (
            <div className="lg:col-span-8 lg:pr-12 group">
              {/* Oversized image container */}
              <Link
                href={`/blog/${heroArticle.slug}`}
                className="block relative aspect-[16/10] sm:aspect-[16/9] rounded-2xl sm:rounded-3xl overflow-hidden bg-surface-muted mb-6 lg:mb-8 lg:-mr-8 shadow-soft"
              >
                <Image
                  src={heroArticle.featuredImage || '/images/jalsa_gallery/jalsa-main-stage-keynote-podium.jpg'}
                  alt={heroArticle.title}
                  fill
                  className="object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                  priority
                />
                {/* Cinematic bottom gradient */}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-forest-950/60 to-transparent" />

                {/* Category pill */}
                <div className="absolute top-4 left-4 sm:top-5 sm:left-5">
                  <span className="px-3 py-1.5 rounded-full bg-teal text-white text-[10px] sm:text-[11px] font-bold tracking-wide shadow-sm">
                    {heroArticle.categories?.[0]?.name || 'Cover Story'}
                  </span>
                </div>
              </Link>

              {/* Text block */}
              <div className="max-w-2xl">
                <div className="flex items-center gap-2.5 sm:gap-3 mb-3 sm:mb-4">
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] text-teal">
                    Lead Editorial
                  </span>
                  <span className="w-6 sm:w-8 h-[1px] bg-teal/30" />
                  <span className="text-[10px] sm:text-[11px] font-medium uppercase tracking-[0.15em] text-ink-muted">
                    Featured Analysis
                  </span>
                </div>

                <Link href={`/blog/${heroArticle.slug}`}>
                  <h1 className="font-display font-extrabold text-2xl sm:text-4xl lg:text-display-lg text-forest group-hover:text-teal transition-colors duration-300 mb-3 sm:mb-5 leading-snug">
                    {heroArticle.title}
                  </h1>
                </Link>

                {heroArticle.subtitle && (
                  <p className="text-ink-muted text-sm sm:text-base leading-relaxed mb-4 sm:mb-6 max-w-xl font-sans">
                    {heroArticle.subtitle}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-xs sm:text-sm text-ink-muted">
                  <div className="flex items-center gap-2 font-medium text-ink-body">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-teal/10 flex items-center justify-center text-teal">
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <span>{heroArticle.author?.name || 'Editorial Board'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-teal font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{heroArticle.readingTime || 5} min read</span>
                  </div>
                  <time className="text-ink-light font-medium">
                    {heroArticle.publishedAt
                      ? new Date(heroArticle.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
                      : 'October 2026'}
                  </time>
                </div>

                {/* AI Concierge Search Assistant Bar */}
                <HeroCompanionBar />
              </div>
            </div>
          )}

          {/* ── Secondary Stories: Right 4 cols — staggered, offset ── */}
          <div className="lg:col-span-4 lg:pt-8 flex flex-col gap-1">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-teal/15">
              <h2 className="text-xs font-display font-bold tracking-[0.15em] uppercase text-forest">
                Latest Blog Highlights
              </h2>
              <Link href="/blog" className="text-xs font-semibold text-teal hover:text-forest flex items-center gap-1 transition-colors">
                <span>View All</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-0 divide-y divide-surface-border/60">
              {secondaryArticles.slice(0, 3).map((article: any, index: number) => (
                <article
                  key={article.id || index}
                  className="py-5 first:pt-0 last:pb-0 group"
                >
                  <div className="flex gap-4 items-start">
                    {/* Staggered numeral — large, muted */}
                    <span className="font-display font-extrabold text-3xl text-surface-border group-hover:text-teal/30 transition-colors select-none leading-none shrink-0 mt-0.5">
                      {String(index + 1).padStart(2, '0')}
                    </span>

                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-semibold uppercase tracking-widest text-teal mb-1.5 block">
                        {article.categories?.[0]?.name || 'Editorial'}
                      </span>

                      <Link href={`/blog/${article.slug}`}>
                        <h3 className="font-display font-bold text-[15px] text-ink-heading group-hover:text-teal transition-colors line-clamp-2 leading-snug mb-2">
                          {article.title}
                        </h3>
                      </Link>

                      <div className="flex items-center gap-2 text-[12px] text-ink-muted">
                        <span className="font-semibold text-ink-body">{article.author?.name}</span>
                        <span className="text-surface-border">·</span>
                        <span className="text-teal font-medium">{article.readingTime || 4} min</span>
                      </div>
                    </div>

                    {/* Thumbnail — slightly rounded, smaller */}
                    <Link
                      href={`/blog/${article.slug}`}
                      className="block relative w-20 h-20 shrink-0 rounded-2xl overflow-hidden bg-surface-muted"
                    >
                      <Image
                        src={article.featuredImage || '/images/jalsa_gallery/jalsa-crowd-marquee-gathering.jpg'}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
