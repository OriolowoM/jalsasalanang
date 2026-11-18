import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, ArrowRight, Bookmark } from 'lucide-react';

interface Props {
  editorsPicks: any[];
  latestArticles: any[];
}

export default function EditorialGrid({ editorsPicks = [], latestArticles = [] }: Props) {
  return (
    <section className="py-20 sm:py-28 bg-surface-bg border-b border-surface-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Editor's Picks (8 cols) */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between pb-4 mb-8 border-b border-teal/20">
              <div className="flex items-center gap-2.5">
                <Bookmark className="w-5 h-5 text-teal" />
                <h2 className="font-display font-extrabold text-display-sm text-forest tracking-tight">
                  Editor&apos;s Picks &amp; Special Features
                </h2>
              </div>
              <span className="text-[11px] font-display font-bold text-teal uppercase tracking-[0.2em]">
                In-Depth Research
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              {editorsPicks.slice(0, 4).map((article: any, idx: number) => (
                <article
                  key={article.id}
                  className={`bg-white rounded-3xl overflow-hidden border border-surface-border/60 shadow-soft flex flex-col justify-between group hover:shadow-soft-lg hover:border-teal/30 hover:-translate-y-1 transition-all duration-300 ${
                    idx % 2 === 1 ? 'sm:translate-y-2' : ''
                  }`}
                >
                  <div>
                    <Link href={`/blog/${article.slug}`} className="block relative aspect-[16/10] bg-surface-muted overflow-hidden">
                      <Image
                        src={article.featuredImage || '/images/jalsa_gallery/jalsa-crowd-marquee-gathering.jpg'}
                        alt={article.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-forest-950/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-teal text-white text-[10px] font-bold uppercase tracking-wider shadow">
                        {article.categories?.[0]?.name || 'Editorial'}
                      </span>
                    </Link>

                    <div className="p-6">
                      <Link href={`/blog/${article.slug}`}>
                        <h3 className="font-display font-bold text-lg text-forest group-hover:text-teal transition-colors leading-snug mb-2.5">
                          {article.title}
                        </h3>
                      </Link>

                      {article.subtitle && (
                        <p className="text-xs text-ink-muted line-clamp-2 leading-relaxed mb-4 font-sans">
                          {article.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-3 border-t border-surface-border/40 flex items-center justify-between text-xs text-ink-muted">
                    <span className="font-semibold text-ink-body truncate max-w-[150px]">
                      {article.author?.name}
                    </span>
                    <span className="flex items-center gap-1.5 flex-shrink-0 text-teal font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      {article.readingTime || 5} min read
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Right Column: Latest Updates & Stream (4 cols) */}
          <div className="lg:col-span-4 bg-white p-7 sm:p-8 rounded-4xl border border-surface-border/60 shadow-soft flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-teal/15">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green animate-pulse"></span>
                  <h3 className="text-xs font-display font-bold uppercase tracking-[0.2em] text-forest">
                    Latest Dispatches
                  </h3>
                </div>
                <Link href="/blog" className="text-xs font-bold text-teal hover:text-forest flex items-center gap-1 transition-colors">
                  <span>Full Blog</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="divide-y divide-surface-border/40">
                {latestArticles.slice(0, 5).map((article: any, index: number) => (
                  <article key={article.id || index} className="py-4 first:pt-1 group hover:bg-surface-bg -mx-3 px-3 rounded-2xl transition-all">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-teal bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        {article.categories?.[0]?.name || 'News'}
                      </span>
                      <span className="text-[10px] text-surface-border">•</span>
                      <time className="text-[10px] text-ink-muted font-medium">
                        {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent'}
                      </time>
                    </div>

                    <Link href={`/blog/${article.slug}`}>
                      <h4 className="font-display font-bold text-sm text-ink-heading group-hover:text-teal transition-colors leading-snug line-clamp-2">
                        {article.title}
                      </h4>
                    </Link>

                    <div className="flex items-center gap-2 text-[11px] text-ink-muted mt-2 font-medium">
                      <span>By {article.author?.name || 'Staff Reporter'}</span>
                      <span>•</span>
                      <span className="text-teal font-semibold">{article.readingTime || 3} min</span>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* In-feed promo with soft teal styling */}
            <div className="mt-8 p-5 rounded-2xl bg-teal-50 border border-teal-200 text-xs text-forest shadow-soft">
              <strong className="block font-display font-bold text-forest mb-1.5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green"></span>
                <span>Press Inquiries &amp; Accreditation</span>
              </strong>
              <p className="text-ink-muted mb-3 font-sans leading-relaxed">
                Accreditation for local and foreign journalists attending Jalsa 2026 is managed directly through our press unit.
              </p>
              <Link href="/contact" className="font-bold text-teal hover:text-forest transition-colors inline-flex items-center gap-1.5">
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
