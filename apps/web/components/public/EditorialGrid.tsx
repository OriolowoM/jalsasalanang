import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, User, ArrowRight, Bookmark } from 'lucide-react';

interface Props {
  editorsPicks: any[];
  latestArticles: any[];
}

export default function EditorialGrid({ editorsPicks = [], latestArticles = [] }: Props) {
  return (
    <section className="py-14 sm:py-16 bg-surface-bg border-b border-surface-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Editor's Picks (8 cols) */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between pb-3.5 mb-8 border-b-2 border-primary">
              <div className="flex items-center gap-2.5">
                <Bookmark className="w-5 h-5 text-gold-metallic" />
                <h2 className="font-display font-black text-xl sm:text-2xl text-charcoal-heading tracking-tight">
                  Editor&apos;s Picks &amp; Special Features
                </h2>
              </div>
              <span className="text-[11px] font-cinzel font-bold text-gold-dark uppercase tracking-[0.2em]">
                In-Depth Research
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              {editorsPicks.slice(0, 4).map((article: any) => (
                <article
                  key={article.id}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-200/80 shadow-sm flex flex-col justify-between group hover:shadow-prestige hover:border-gold/50 hover:-translate-y-1 transition-all duration-500"
                >
                  <div>
                    <Link href={`/articles/${article.slug}`} className="block relative aspect-[16/10] bg-gray-100 overflow-hidden">
                      <Image
                        src={article.featuredImage || '/images/jalsa-convention-a.jpg'}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-106 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-primary-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-primary text-white text-[10px] font-black uppercase tracking-wider shadow border border-primary-300/30">
                        {article.categories?.[0]?.name || 'Editorial'}
                      </span>
                    </Link>

                    <div className="p-5 sm:p-6">
                      <Link href={`/articles/${article.slug}`}>
                        <h3 className="font-display font-bold text-lg text-charcoal group-hover:text-primary transition-colors leading-snug mb-2.5">
                          {article.title}
                        </h3>
                      </Link>

                      {article.subtitle && (
                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-4 font-serif">
                          {article.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="px-5 sm:px-6 pb-5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-charcoal-muted">
                    <span className="font-semibold text-charcoal truncate max-w-[150px]">
                      {article.author?.name}
                    </span>
                    <span className="flex items-center gap-1.5 flex-shrink-0 text-gold-dark font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      {article.readingTime || 5} min read
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Right Column: Latest Updates & Stream (4 cols) */}
          <div className="lg:col-span-4 bg-white p-6 sm:p-7 rounded-2xl border border-gray-200/80 shadow-prestige flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3.5 mb-5 border-b-2 border-gold/40">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-gold animate-pulse"></span>
                  <h3 className="text-xs font-cinzel font-black uppercase tracking-[0.2em] text-primary">
                    Latest Dispatches
                  </h3>
                </div>
                <Link href="/articles" className="text-xs font-bold text-gold-dark hover:text-primary flex items-center gap-1 transition-colors">
                  <span>Archive</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="divide-y divide-gray-100">
                {latestArticles.slice(0, 5).map((article: any, index: number) => (
                  <article key={article.id || index} className="py-4 first:pt-1 group hover:bg-surface-parchment/60 -mx-3 px-3 rounded-xl transition-all">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-black uppercase tracking-wider text-gold-dark bg-gold/10 px-2 py-0.5 rounded border border-gold/30">
                        {article.categories?.[0]?.name || 'News'}
                      </span>
                      <span className="text-[10px] text-gray-300">•</span>
                      <time className="text-[10px] text-gray-400 font-medium">
                        {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent'}
                      </time>
                    </div>

                    <Link href={`/articles/${article.slug}`}>
                      <h4 className="font-display font-bold text-sm text-charcoal group-hover:text-primary transition-colors leading-snug line-clamp-2">
                        {article.title}
                      </h4>
                    </Link>

                    <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-2 font-medium">
                      <span>By {article.author?.name || 'Staff Reporter'}</span>
                      <span>•</span>
                      <span className="text-gold-dark">{article.readingTime || 3} min</span>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* In-feed promo with luxury gold styling */}
            <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-primary-subtle to-amber-50/40 border border-gold/30 text-xs text-primary-dark shadow-sm">
              <strong className="block font-bold text-primary mb-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-gold"></span>
                <span>Press Inquiries &amp; Accreditation</span>
              </strong>
              <p className="text-gray-600 mb-2 font-serif">
                Accreditation for local and foreign journalists attending Jalsa 2026 is managed directly through our press unit.
              </p>
              <Link href="/contact" className="font-bold text-primary hover:text-gold-dark transition-colors inline-flex items-center gap-1">
                <span>Apply for Press Pass</span>
                <span>&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
