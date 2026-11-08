import React from 'react';
import Link from 'next/link';
import { searchContent } from '@/lib/api';
import { Search, BookOpen, Mic, Calendar, User, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Search Publication Archives',
  description: 'Search across seven decades of articles, keynote speeches, conventions, and scholars from Jalsa Salana Nigeria.',
};

export default async function SearchResultsPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams.q || '';
  let results: any = null;

  if (query) {
    try {
      const res = await searchContent(query);
      if (res.success) {
        results = res.data;
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="py-8 sm:py-12 bg-surface-bg min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header */}
        <div className="pb-6 mb-8 border-b-2 border-primary">
          <span className="text-xs font-extrabold uppercase tracking-widest text-gold-dark block mb-1">
            Global Search
          </span>
          <h1 className="font-serif font-black text-3xl sm:text-4xl text-charcoal">
            {query ? `Search Results for "${query}"` : 'Search Publication Archives'}
          </h1>
          {results && (
            <p className="text-xs text-gray-500 mt-2 font-medium">
              Found {results.totalResults} matching records across all archives
            </p>
          )}
        </div>

        {/* Search Bar */}
        <form method="GET" action="/search" className="mb-10">
          <div className="flex items-center gap-2 p-2 bg-white rounded-xl border border-gray-200 shadow-sm">
            <Search className="w-5 h-5 text-gray-400 ml-2" />
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search by keywords, themes, speakers, or editions..."
              className="w-full text-base outline-none p-2 text-charcoal bg-transparent"
            />
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white font-bold text-xs uppercase tracking-wider transition-colors shadow"
            >
              Search
            </button>
          </div>
        </form>

        {/* Results Sections */}
        {results ? (
          results.totalResults === 0 ? (
            <div className="p-12 text-center bg-white rounded-xl border border-gray-200 shadow-sm">
              <h3 className="font-serif font-bold text-lg text-charcoal mb-1">No matching results</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                No items matched &ldquo;{query}&rdquo;. Try searching for &ldquo;Taqwa&rdquo;, &ldquo;Justice&rdquo;, &ldquo;Khilafat&rdquo;, or &ldquo;2024&rdquo;.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Articles Results */}
              {results.articles.length > 0 && (
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="font-serif font-bold text-lg text-primary mb-4 flex items-center gap-2 pb-2 border-b border-gray-100">
                    <BookOpen className="w-4 h-4" /> Articles ({results.articles.length})
                  </h3>
                  <div className="divide-y divide-gray-100">
                    {results.articles.map((art: any) => (
                      <div key={art.id} className="py-4 first:pt-0 last:pb-0 group">
                        <Link href={`/articles/${art.slug}`}>
                          <h4 className="font-serif font-bold text-base text-charcoal group-hover:text-primary transition-colors">
                            {art.title}
                          </h4>
                        </Link>
                        {art.subtitle && (
                          <p className="text-xs text-gray-500 line-clamp-2 mt-1">{art.subtitle}</p>
                        )}
                        <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-2">
                          <span>By {art.author?.name}</span>
                          <span>•</span>
                          <span>{art.categories?.[0]?.name || 'Article'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Speeches Results */}
              {results.speeches.length > 0 && (
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="font-serif font-bold text-lg text-primary mb-4 flex items-center gap-2 pb-2 border-b border-gray-100">
                    <Mic className="w-4 h-4" /> Speeches &amp; Sermons ({results.speeches.length})
                  </h3>
                  <div className="divide-y divide-gray-100">
                    {results.speeches.map((sp: any) => (
                      <div key={sp.id} className="py-4 first:pt-0 last:pb-0 group">
                        <Link href={`/speeches/${sp.slug}`}>
                          <h4 className="font-serif font-bold text-base text-charcoal group-hover:text-primary transition-colors">
                            {sp.title}
                          </h4>
                        </Link>
                        <div className="text-xs text-primary font-bold mt-1">{sp.speakerName}</div>
                        {sp.summary && (
                          <p className="text-xs text-gray-500 line-clamp-2 mt-1">{sp.summary}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Editions Results */}
              {results.editions.length > 0 && (
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                  <h3 className="font-serif font-bold text-lg text-primary mb-4 flex items-center gap-2 pb-2 border-b border-gray-100">
                    <Calendar className="w-4 h-4" /> Conventions ({results.editions.length})
                  </h3>
                  <div className="divide-y divide-gray-100">
                    {results.editions.map((ed: any) => (
                      <div key={ed.id} className="py-3 first:pt-0 last:pb-0">
                        <Link href={`/editions/${ed.year}`} className="font-bold text-sm text-charcoal hover:text-primary">
                          {ed.year} — {ed.editionNumber}
                        </Link>
                        <div className="text-xs text-gray-500 mt-0.5">{ed.themeEnglish}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        ) : (
          <div className="py-12 text-center text-xs text-gray-400">
            Enter search terms above to search all Jalsa Salana publications.
          </div>
        )}
      </div>
    </div>
  );
}
