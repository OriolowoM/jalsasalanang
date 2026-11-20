import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getArticleFeaturedImage } from '@/lib/article-images';
import { semanticSearch } from '@/lib/api';
import {
  Search,
  BookOpen,
  Mic,
  Calendar,
  User,
  ArrowRight,
  Sparkles,
  Tag,
  Clock,
  Compass,
  CheckCircle2,
} from 'lucide-react';
import { constructMetadata } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'Search Jalsa Salana Nigeria Archives',
  description:
    'Intent-based semantic search across seven decades of scholarly articles, keynote speeches, conventions, and theological discourses.',
  path: '/search',
});

export default async function SearchResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q || '';

  let semanticData: {
    thematicSummary: string;
    extractedThemes: string[];
    articles: any[];
    speeches: any[];
    totalResults: number;
  } | null = null;

  if (query) {
    try {
      const res = await semanticSearch(query);
      if (res.success && res.data) {
        semanticData = res.data;
      }
    } catch (err) {
      console.error('Semantic search error:', err);
    }
  }

  const articles = semanticData?.articles || [];
  const speeches = semanticData?.speeches || [];
  const themes = semanticData?.extractedThemes || [];
  const totalResults = semanticData?.totalResults ?? 0;

  return (
    <div className="py-10 sm:py-16 bg-surface-bg min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header */}
        <div className="max-w-3xl mb-8">
          <div className="flex items-center gap-2 text-xs font-bold text-teal uppercase tracking-widest mb-2">
            <Sparkles className="w-4 h-4 text-lime" />
            <span>AI-Powered Semantic Knowledge Retrieval</span>
          </div>

          <h1 className="font-display font-black text-3xl sm:text-5xl text-forest tracking-tight mb-4">
            {query ? `Search: “${query}”` : 'Search Publication Archives'}
          </h1>

          <p className="text-sm sm:text-base text-ink-muted">
            Intent-based theological search across conventions, keynote addresses, and scholarly discourses.
          </p>
        </div>

        {/* Search Bar Input */}
        <form method="GET" action="/search" className="mb-10">
          <div className="relative flex items-center gap-2 p-2 sm:p-2.5 bg-white rounded-2xl border border-surface-border shadow-soft-lg hover:border-teal/40 focus-within:border-teal transition-all">
            <Search className="w-5 h-5 text-teal ml-3 flex-shrink-0" />
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search concepts e.g., 'spiritual peace in hardship', 'women in Islam', 'justice and taqwa'..."
              className="w-full text-xs sm:text-sm outline-none px-3 py-2 text-forest bg-transparent font-medium"
            />
            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-forest hover:bg-forest-900 text-white font-display font-bold text-xs uppercase tracking-wider transition-all shadow-sm flex-shrink-0"
            >
              Analyze &amp; Search
            </button>
          </div>

          {/* Quick theme search pills */}
          <div className="mt-3 flex items-center gap-2 flex-wrap text-xs text-ink-muted">
            <span className="text-[11px] font-bold text-ink-light">Popular themes:</span>
            {['Justice & Peace', 'Spiritual Purity', '72nd Jalsa 2026', 'Taqwa', 'Khilafat Guidance'].map((pill) => (
              <Link
                key={pill}
                href={`/search?q=${encodeURIComponent(pill)}`}
                className="px-2.5 py-1 rounded-full bg-white hover:bg-teal hover:text-white border border-surface-border text-[11px] font-medium transition-colors"
              >
                {pill}
              </Link>
            ))}
          </div>
        </form>

        {query && semanticData && (
          <div className="space-y-10">
            {/* ── Top Feature Section: AI Thematic Intent Summary Card ── */}
            {semanticData.thematicSummary && (
              <div className="relative rounded-3xl bg-gradient-to-br from-forest-950 via-forest to-forest-900 text-white p-6 sm:p-8 shadow-xl border border-teal/30 overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-teal/20 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-lime text-forest-950 font-display font-black text-[10px] uppercase tracking-wider flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Thematic Synthesis
                    </span>
                    <span className="text-xs text-white/60">
                      Grounded in Ahmadiyya Teachings
                    </span>
                  </div>

                  <p className="font-display font-medium text-base sm:text-lg leading-relaxed text-white/95 max-w-4xl mb-6">
                    {semanticData.thematicSummary}
                  </p>

                  {/* Extracted Core Themes Pills */}
                  {themes.length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap pt-4 border-t border-white/10">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-lime">
                        Identified Theological Themes:
                      </span>
                      {themes.map((theme, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold border border-white/15"
                        >
                          #{theme}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Total Results Count */}
            <div className="flex items-center justify-between text-xs font-bold text-ink-muted pb-2 border-b border-surface-border">
              <span>FOUND {totalResults} MATCHING ARCHIVE RECORDS</span>
              <span>SEMANTIC INTENT MATCH</span>
            </div>

            {totalResults === 0 ? (
              <div className="py-16 text-center bg-white rounded-3xl border border-surface-border p-8">
                <Compass className="w-10 h-10 text-ink-light mx-auto mb-3" />
                <h3 className="font-display font-bold text-base text-forest mb-1">
                  No records matched this specific query
                </h3>
                <p className="text-xs text-ink-muted max-w-sm mx-auto">
                  Try exploring one of the popular theological themes above or query the Jalsa Companion directly.
                </p>
              </div>
            ) : (
              <div className="space-y-12">
                {/* ── Masonry Grid of Matched Articles ── */}
                {articles.length > 0 && (
                  <div>
                    <h3 className="font-display font-black text-xl text-forest mb-6 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-teal" />
                      <span>Editorial Articles &amp; Papers ({articles.length})</span>
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {articles.map((art: any, idx: number) => (
                        <article
                          key={art.id}
                          className="rounded-3xl bg-white border border-surface-border overflow-hidden hover:border-teal/40 transition-all hover:shadow-soft flex flex-col justify-between group"
                        >
                          <div>
                            {/* Card Image */}
                            <Link href={`/blog/${art.slug}`} className="block relative aspect-[16/10] bg-surface-muted overflow-hidden">
                              <Image
                                src={getArticleFeaturedImage(art, idx)}
                                alt={art.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              <div className="absolute top-3 left-3">
                                <span className="px-2.5 py-1 rounded-full bg-forest text-white text-[10px] font-bold">
                                  {art.categories?.[0]?.name || 'Editorial'}
                                </span>
                              </div>
                            </Link>

                            {/* Card Content */}
                            <div className="p-5">
                              <Link href={`/blog/${art.slug}`}>
                                <h4 className="font-display font-bold text-base text-forest group-hover:text-teal transition-colors line-clamp-2 mb-2">
                                  {art.title}
                                </h4>
                              </Link>

                              {art.subtitle && (
                                <p className="text-xs text-ink-muted line-clamp-2 leading-relaxed mb-4">
                                  {art.subtitle}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Card Footer Metadata */}
                          <div className="px-5 pb-5 pt-3 border-t border-surface-border/60 flex items-center justify-between text-[11px] text-ink-muted">
                            <span className="font-semibold text-ink-body truncate max-w-[140px]">
                              {art.author?.name || 'Editorial Board'}
                            </span>
                            <span className="text-teal font-medium flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {art.readingTime || 4}m read
                            </span>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── Matched Keynote Speeches ── */}
                {speeches.length > 0 && (
                  <div>
                    <h3 className="font-display font-black text-xl text-forest mb-6 flex items-center gap-2">
                      <Mic className="w-5 h-5 text-teal" />
                      <span>Convention Speeches &amp; Addresses ({speeches.length})</span>
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {speeches.map((sp: any) => (
                        <div
                          key={sp.id}
                          className="p-5 rounded-2xl bg-white border border-surface-border hover:border-teal/40 transition-all hover:shadow-soft"
                        >
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <h4 className="font-display font-bold text-base text-forest">
                              {sp.title}
                            </h4>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-50 text-teal font-bold flex-shrink-0">
                              {sp.edition?.editionNumber || 'Convention Speech'}
                            </span>
                          </div>

                          <div className="text-xs font-semibold text-teal mb-2">
                            Speaker: {sp.speakerName}
                          </div>

                          {sp.summary && (
                            <p className="text-xs text-ink-muted line-clamp-2 leading-relaxed mb-3">
                              {sp.summary}
                            </p>
                          )}

                          <Link
                            href={`/speeches/${sp.slug}`}
                            className="inline-flex items-center gap-1 text-xs font-bold text-forest hover:text-teal transition-colors"
                          >
                            <span>Read Full Transcript</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
