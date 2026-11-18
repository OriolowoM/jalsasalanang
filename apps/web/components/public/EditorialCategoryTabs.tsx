'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  BookOpen, 
  Clock, 
  ArrowRight, 
  ChevronRight
} from 'lucide-react';

interface ArticleItem {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  featuredImage?: string | null;
  readingTime?: number;
  publishedAt?: string;
  author?: {
    name: string;
    avatar?: string;
  };
  categories?: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
}

interface EditorialCategoryTabsProps {
  articles: ArticleItem[];
}

export default function EditorialCategoryTabs({ articles }: EditorialCategoryTabsProps) {
  const [activeTab, setActiveTab] = useState<string>('all');

  const tabs = [
    { id: 'all', label: 'All Recent Dispatches', count: articles.length },
    { id: 'amirs-corner', label: "Amir's Corner", badge: 'Official' },
    { id: 'convention-lectures', label: 'Convention Lectures', badge: 'Scholarly' },
    { id: 'press-conference', label: 'Press Conferences', badge: 'Media' },
    { id: 'poems-reflections', label: 'Poems & Reflections', badge: 'Literary' },
    { id: 'faith-spirituality', label: 'Faith & Tarbiyya' },
  ];

  // Filter articles based on activeTab
  const filteredArticles = activeTab === 'all'
    ? articles
    : articles.filter(a => 
        a.categories?.some(c => c.slug === activeTab) ||
        (activeTab === 'amirs-corner' && (/Amir/i.test(a.title) || /Alatoye/i.test(a.title))) ||
        (activeTab === 'convention-lectures' && (/Lecture/i.test(a.title) || /Speech/i.test(a.title))) ||
        (activeTab === 'press-conference' && /Press/i.test(a.title)) ||
        (activeTab === 'poems-reflections' && (/Poem/i.test(a.title) || /Diversity/i.test(a.title) || /Story/i.test(a.title)))
      );

  const displayedArticles = filteredArticles.slice(0, 9);

  return (
    <section className="py-12 sm:py-20 lg:py-28 bg-surface-bg border-b border-surface-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 pb-6 sm:pb-8 border-b border-surface-border/60 gap-4 sm:gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 text-teal text-xs font-display font-bold uppercase tracking-widest mb-3 border border-teal-200">
              <BookOpen className="w-3.5 h-3.5 text-teal" />
              <span>Digital Magazine Archives &amp; Dispatches</span>
            </div>
            <h2 className="font-display font-extrabold text-2xl sm:text-display-md text-forest leading-tight">
              Explore Publication Columns
            </h2>
            <p className="text-sm sm:text-base text-ink-muted mt-2 max-w-2xl font-sans">
              Spiritual treatises, addresses by Amir Sahib, historical lecture transcripts, and heartfelt reflections from 70+ editions of Jalsa Salana Nigeria.
            </p>
          </div>

          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-teal hover:text-forest transition-colors flex-shrink-0"
          >
            <span>Browse Full Blog (148 Posts)</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Thematic Tabs Navigation — smooth swipe on mobile */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-teal text-white shadow-soft'
                    : 'bg-white border border-surface-border/60 text-ink-heading hover:border-teal/40 hover:text-teal'
                }`}
              >
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded-md font-extrabold ${
                    isActive ? 'bg-lime text-forest' : 'bg-surface-muted text-ink-muted'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Articles Grid (3x3) */}
        {displayedArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedArticles.map((article, idx) => {
              const primaryCategory = article.categories?.[0]?.name || 'Editorial';
              const readTime = article.readingTime || 4;

              return (
                <article
                  key={article.id}
                  className={`bg-white border border-surface-border/60 rounded-3xl overflow-hidden shadow-soft hover:shadow-soft-lg transition-all duration-300 flex flex-col justify-between group hover:border-teal/30 hover:-translate-y-1 ${
                    idx % 3 === 1 ? 'lg:translate-y-2' : ''
                  }`}
                >
                  <div>
                    {/* Thumbnail Image */}
                    <div className="relative w-full h-52 bg-surface-muted overflow-hidden">
                      {article.featuredImage ? (
                        <Image
                          src={article.featuredImage}
                          alt={article.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-forest flex flex-col items-center justify-center text-white p-4 text-center">
                          <span className="text-xs font-display font-extrabold uppercase tracking-widest text-lime mb-1">
                            Jalsa Salana Nigeria
                          </span>
                          <span className="text-[10px] font-sans uppercase tracking-wider text-white/60">
                            Digital Dispatch
                          </span>
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/95 text-forest shadow-sm backdrop-blur-sm">
                          {primaryCategory}
                        </span>
                      </div>
                    </div>

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
                            <span>{new Date(article.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          </>
                        )}
                      </div>

                      <h3 className="font-display font-bold text-lg sm:text-xl text-forest group-hover:text-teal leading-snug line-clamp-2 transition-colors">
                        <Link href={`/blog/${article.slug}`}>
                          {article.title}
                        </Link>
                      </h3>

                      {article.excerpt && (
                        <p className="mt-2.5 text-xs sm:text-sm text-ink-muted font-sans line-clamp-3 leading-relaxed">
                          {article.excerpt}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Card Footer: Author & Read Link */}
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
                      <span>Read Story</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-surface-border/60 p-12 text-center">
            <BookOpen className="w-8 h-8 text-teal mx-auto mb-3" />
            <h3 className="font-display font-bold text-lg text-forest">No articles found in this category yet.</h3>
            <p className="text-xs text-ink-muted mt-1 font-sans">
              Check back soon or explore our complete library.
            </p>
          </div>
        )}

        {/* View All CTA Button */}
        <div className="mt-14 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-teal hover:bg-teal-600 text-white font-bold text-xs uppercase tracking-wider shadow-soft transition-all hover:scale-105 active:scale-95"
          >
            <span>View All 148 Blog Posts</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
