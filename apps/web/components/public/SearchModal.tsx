'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, X, BookOpen, Mic, Calendar, User, ArrowRight } from 'lucide-react';
import { searchContent } from '@/lib/api';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: Props) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await searchContent(query);
        if (res.success) {
          setResults(res.data);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onClose();
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-24 px-4">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <form onSubmit={handleSubmit} className="p-4 border-b border-gray-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles, speeches, historical editions, scholars..."
            className="w-full text-base sm:text-lg outline-none text-charcoal placeholder-gray-400 bg-transparent"
            autoFocus
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-gray-400 hover:text-gray-600 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="text-xs uppercase font-bold tracking-wider px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded"
          >
            ESC
          </button>
        </form>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 divide-y divide-gray-100">
          {loading && (
            <div className="py-8 text-center text-sm text-gray-500">
              <span className="inline-block animate-spin mr-2">⟳</span> Searching across all publication archives...
            </div>
          )}

          {!loading && results && results.totalResults === 0 && (
            <div className="py-10 text-center text-gray-500">
              <p className="font-medium text-charcoal">No direct matches found for &quot;{query}&quot;</p>
              <p className="text-xs text-gray-400 mt-1">Try searching by topic, such as &quot;Taqwa&quot;, &quot;Justice&quot;, &quot;Khilafat&quot;, or &quot;2024&quot;.</p>
            </div>
          )}

          {!loading && results && results.totalResults > 0 && (
            <div className="space-y-4">
              {/* Articles */}
              {results.articles.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-primary mb-2 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" /> Articles & Reports ({results.articles.length})
                  </h4>
                  <div className="space-y-2">
                    {results.articles.slice(0, 4).map((art: any) => (
                      <Link
                        key={art.id}
                        href={`/articles/${art.slug}`}
                        onClick={onClose}
                        className="block p-2 rounded-lg hover:bg-primary-subtle transition-colors group"
                      >
                        <div className="font-serif font-bold text-sm text-charcoal group-hover:text-primary transition-colors">
                          {art.title}
                        </div>
                        {art.subtitle && (
                          <div className="text-xs text-gray-500 line-clamp-1 mt-0.5">{art.subtitle}</div>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Speeches */}
              {results.speeches.length > 0 && (
                <div className="pt-3">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-primary mb-2 flex items-center gap-1.5">
                    <Mic className="w-3.5 h-3.5" /> Speeches & Addresses ({results.speeches.length})
                  </h4>
                  <div className="space-y-2">
                    {results.speeches.slice(0, 3).map((sp: any) => (
                      <Link
                        key={sp.id}
                        href={`/speeches/${sp.slug}`}
                        onClick={onClose}
                        className="block p-2 rounded-lg hover:bg-primary-subtle transition-colors group"
                      >
                        <div className="font-semibold text-sm text-charcoal group-hover:text-primary transition-colors">
                          {sp.title}
                        </div>
                        <div className="text-xs text-gold-dark font-medium mt-0.5">{sp.speakerName}</div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Editions */}
              {results.editions.length > 0 && (
                <div className="pt-3">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-primary mb-2 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> Jalsa Editions ({results.editions.length})
                  </h4>
                  <div className="space-y-2">
                    {results.editions.map((ed: any) => (
                      <Link
                        key={ed.id}
                        href={`/editions/${ed.year}`}
                        onClick={onClose}
                        className="block p-2 rounded-lg hover:bg-primary-subtle transition-colors group"
                      >
                        <div className="font-bold text-sm text-charcoal group-hover:text-primary">
                          {ed.year} — {ed.editionNumber}
                        </div>
                        <div className="text-xs text-gray-500 line-clamp-1">{ed.themeEnglish}</div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Full Results Link */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full py-2 text-center text-xs font-bold text-primary hover:text-primary-dark flex items-center justify-center gap-1 border-t border-gray-100"
                >
                  View all {results.totalResults} results <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {!query && (
            <div className="py-6 text-center text-xs text-gray-400">
              Type keywords above to instantly search across speeches, theological treatises, and historical archives.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
