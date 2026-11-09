import React from 'react';
import Link from 'next/link';
import { History, Calendar, MapPin, ArrowRight } from 'lucide-react';

interface Props {
  editions: any[];
}

export default function ArchivesTimeline({ editions = [] }: Props) {
  if (editions.length === 0) return null;

  return (
    <section className="py-14 sm:py-16 bg-white border-b border-surface-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3.5 mb-8 border-b-2 border-primary gap-3">
          <div>
            <div className="flex items-center gap-2.5">
              <History className="w-5 h-5 text-gold-metallic" />
              <h2 className="font-display font-black text-2xl sm:text-3xl text-charcoal-heading tracking-tight">
                Historical Jalsa Archives
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 font-serif">
              Explore seven decades of spiritual conventions, official communiques, keynote addresses, and historical milestones.
            </p>
          </div>
          <Link
            href="/editions"
            className="text-xs font-cinzel font-black uppercase tracking-[0.2em] text-gold-dark hover:text-primary flex items-center gap-1 flex-shrink-0 transition-colors"
          >
            <span>Complete Archive Index</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {editions.slice(0, 4).map((edition: any) => (
            <Link
              key={edition.id}
              href={`/editions/${edition.year}`}
              className="p-6 rounded-2xl border border-gray-200/80 bg-surface-bg hover:bg-white hover:border-gold/60 transition-all duration-500 group flex flex-col justify-between shadow-sm hover:shadow-prestige hover:-translate-y-1.5"
            >
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <span className="font-display font-black text-3xl text-primary group-hover:text-gold-dark transition-colors">
                    {edition.year}
                  </span>
                  <span className="text-[10px] font-cinzel font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white text-gray-700 border border-gold/30 shadow-xs">
                    {edition.editionNumber}
                  </span>
                </div>

                <h3 className="font-display font-bold text-sm text-charcoal group-hover:text-primary transition-colors leading-snug mb-2.5 line-clamp-2">
                  {edition.themeEnglish}
                </h3>

                <div className="space-y-1.5 text-xs text-gray-500 mb-4 font-serif">
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

              <div className="pt-3 border-t border-gray-200/60 flex items-center justify-between text-xs font-bold text-primary group-hover:text-gold-dark transition-colors">
                <span>View Convention Hub</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
