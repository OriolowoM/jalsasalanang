import React from 'react';
import Link from 'next/link';
import { History, Calendar, MapPin, ArrowRight } from 'lucide-react';

interface Props {
  editions: any[];
}

export default function ArchivesTimeline({ editions = [] }: Props) {
  if (editions.length === 0) return null;

  return (
    <section className="py-12 bg-white border-b border-surface-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 mb-8 border-b-2 border-primary gap-2">
          <div>
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-primary" />
              <h2 className="font-serif font-black text-2xl sm:text-3xl text-charcoal-heading">
                Historical Jalsa Archives
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Explore seven decades of spiritual conventions, official communiques, keynote addresses, and historical milestones.
            </p>
          </div>
          <Link
            href="/editions"
            className="text-xs font-bold uppercase tracking-wider text-gold-dark hover:text-primary flex items-center gap-1 flex-shrink-0"
          >
            Complete Archive Index <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {editions.slice(0, 4).map((edition: any) => (
            <Link
              key={edition.id}
              href={`/editions/${edition.year}`}
              className="p-5 rounded-xl border border-gray-100 bg-surface-bg hover:border-gold/50 transition-all group flex flex-col justify-between shadow-sm hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-serif font-black text-2xl text-primary group-hover:text-gold-dark transition-colors">
                    {edition.year}
                  </span>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-white text-gray-700 border border-gray-200">
                    {edition.editionNumber}
                  </span>
                </div>

                <h3 className="font-serif font-bold text-sm text-charcoal group-hover:text-primary transition-colors leading-snug mb-2 line-clamp-2">
                  {edition.themeEnglish}
                </h3>

                <div className="space-y-1 text-xs text-gray-500 mb-4">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-gold-dark" />
                    <span>{edition.dates}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-gold-dark" />
                    <span className="truncate">{edition.venue}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200/60 flex items-center justify-between text-xs font-semibold text-primary">
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
