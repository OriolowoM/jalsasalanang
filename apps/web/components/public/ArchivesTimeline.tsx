import React from 'react';
import Link from 'next/link';
import { History, Calendar, MapPin, ArrowRight } from 'lucide-react';

interface Props {
  editions: any[];
}

export default function ArchivesTimeline({ editions = [] }: Props) {
  if (editions.length === 0) return null;

  return (
    <section className="py-20 sm:py-28 bg-white border-b border-surface-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 mb-10 border-b border-teal/20 gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <History className="w-5 h-5 text-teal" />
              <h2 className="font-display font-extrabold text-display-md text-forest tracking-tight">
                Historical Jalsa Archives
              </h2>
            </div>
            <p className="text-sm text-ink-muted font-sans">
              Explore seven decades of spiritual conventions, official communiques, keynote addresses, and historical milestones.
            </p>
          </div>
          <Link
            href="/editions"
            className="text-xs font-display font-bold uppercase tracking-[0.2em] text-teal hover:text-forest flex items-center gap-1.5 flex-shrink-0 transition-colors"
          >
            <span>Complete Archive Index</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {editions.slice(0, 4).map((edition: any, idx: number) => (
            <Link
              key={edition.id}
              href={`/editions/${edition.year}`}
              className={`p-7 rounded-3xl border border-surface-border/60 bg-surface-bg hover:bg-white hover:border-teal/30 transition-all duration-300 group flex flex-col justify-between shadow-soft hover:shadow-soft-lg hover:-translate-y-1 ${
                idx % 2 === 1 ? 'lg:translate-y-2' : ''
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-display font-extrabold text-3xl text-forest group-hover:text-teal transition-colors">
                    {edition.year}
                  </span>
                  <span className="text-[10px] font-display font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-teal-50 text-teal border border-teal-200">
                    {edition.editionNumber}
                  </span>
                </div>

                <h3 className="font-display font-bold text-sm text-ink-heading group-hover:text-teal transition-colors leading-snug mb-3 line-clamp-2">
                  {edition.themeEnglish}
                </h3>

                <div className="space-y-1.5 text-xs text-ink-muted mb-4 font-sans">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-teal" />
                    <span>{edition.dates}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-teal" />
                    <span className="truncate">{edition.venue}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-surface-border/40 flex items-center justify-between text-xs font-bold text-forest group-hover:text-teal transition-colors">
                <span>View Convention Hub</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
