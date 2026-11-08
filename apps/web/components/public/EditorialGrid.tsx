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
    <section className="py-12 bg-surface-bg border-b border-surface-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Editor's Picks (8 cols) */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between pb-3 mb-6 border-b-2 border-primary">
              <div className="flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-gold-dark" />
                <h2 className="font-serif font-black text-xl sm:text-2xl text-charcoal-heading">
                  Editor&apos;s Picks &amp; Special Features
                </h2>
              </div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                In-Depth Research
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              {editorsPicks.slice(0, 4).map((article: any) => (
                <article key={article.id} className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm flex flex-col justify-between group hover:shadow-md transition-all">
                  <div>
                    <Link href={`/articles/${article.slug}`} className="block relative aspect-[16/10] bg-gray-100 overflow-hidden">
                      <Image
                        src={article.featuredImage || '/images/jalsa-convention-a.jpg'}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-primary text-white text-[10px] font-bold uppercase tracking-wider">
                        {article.categories?.[0]?.name || 'Editorial'}
                      </span>
                    </Link>

                    <div className="p-5">
                      <Link href={`/articles/${article.slug}`}>
                        <h3 className="font-serif font-bold text-lg text-charcoal group-hover:text-primary transition-colors leading-snug mb-2">
                          {article.title}
                        </h3>
                      </Link>

                      {article.subtitle && (
                        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-4">
                          {article.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="px-5 pb-5 pt-3 border-t border-gray-50 flex items-center justify-between text-xs text-gray-400">
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
          </div>

          {/* Right Column: Latest Updates & Stream (4 cols) */}
          <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
                <h3 className="text-xs font-black uppercase tracking-widest text-primary">
                  Latest Dispatches
                </h3>
                <Link href="/articles" className="text-xs font-bold text-gold-dark hover:text-primary flex items-center gap-0.5">
                  Archive <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="divide-y divide-gray-100">
                {latestArticles.slice(0, 5).map((article: any, index: number) => (
                  <article key={article.id || index} className="py-3.5 group">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-extrabold uppercase text-gold-dark">
                        {article.categories?.[0]?.name || 'News'}
                      </span>
                      <span className="text-[10px] text-gray-300">•</span>
                      <time className="text-[10px] text-gray-400">
                        {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'Recent'}
                      </time>
                    </div>

                    <Link href={`/articles/${article.slug}`}>
                      <h4 className="font-serif font-bold text-sm text-charcoal group-hover:text-primary transition-colors leading-snug">
                        {article.title}
                      </h4>
                    </Link>

                    <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-1.5">
                      <span>By {article.author?.name || 'Staff Reporter'}</span>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* In-feed promo */}
            <div className="mt-6 p-4 rounded-lg bg-primary-subtle border border-primary-100 text-xs text-primary-dark">
              <strong className="block font-bold text-primary mb-1">Press Inquiries &amp; Accreditation</strong>
              <p className="text-gray-600 mb-2">Accreditation for local and foreign journalists attending Jalsa 2026 is managed directly through our press unit.</p>
              <Link href="/contact" className="font-bold text-primary hover:underline inline-flex items-center gap-1">
                Apply for Press Pass &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
