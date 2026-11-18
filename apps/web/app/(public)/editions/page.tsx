import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getEditions } from '@/lib/api';
import { Calendar, MapPin, Users, ArrowRight, ShieldCheck } from 'lucide-react';

export const metadata = {
  title: 'Historical Jalsa Editions & Conventions Archive',
  description: 'Chronological timeline and permanent archive of Jalsa Salana Nigeria conventions from the 1950s to the upcoming 72nd convention in 2026.',
};

export default async function EditionsArchivePage() {
  const res = await getEditions().catch(() => ({ data: [] }));
  const editions = res.data || [];

  return (
    <div className="py-8 sm:py-12 bg-surface-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="pb-6 mb-10 border-b-2 border-primary">
          <span className="text-xs font-extrabold uppercase tracking-widest text-gold-dark block mb-1">
            Historical Registry
          </span>
          <h1 className="font-serif font-black text-3xl sm:text-4xl lg:text-5xl text-charcoal-heading">
            Historical Jalsa Salana Editions
          </h1>
          <p className="text-sm text-gray-600 mt-2 max-w-3xl leading-relaxed">
            Seven decades of spiritual, intellectual, and humanitarian milestones. Every convention represents a distinct chapter in the history of Islam Ahmadiyya in Nigeria, featuring recorded speeches, communiques, and photo albums.
          </p>
        </div>

        {/* Editions Timeline List */}
        <div className="space-y-8">
          {editions.map((edition: any) => (
            <div
              key={edition.id}
              className={`p-6 sm:p-8 rounded-2xl border transition-all ${
                edition.isCurrent
                  ? 'bg-gradient-to-r from-primary-950 via-primary to-primary-900 text-white border-primary shadow-xl'
                  : 'bg-white text-charcoal border-gray-200 shadow-sm hover:shadow-md'
              }`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Year & Badge */}
                <div className="lg:col-span-3 space-y-2">
                  <div className="flex items-center gap-3">
                    <span className={`font-serif font-black text-4xl sm:text-5xl ${edition.isCurrent ? 'text-gold' : 'text-primary'}`}>
                      {edition.year}
                    </span>
                    {edition.isCurrent && (
                      <span className="px-2.5 py-1 rounded-full bg-gold/30 text-gold-light border border-gold/40 text-[10px] font-extrabold uppercase tracking-wider">
                        Current Milestone
                      </span>
                    )}
                  </div>
                  <div className={`text-xs font-bold uppercase tracking-wider ${edition.isCurrent ? 'text-gray-300' : 'text-gray-500'}`}>
                    {edition.editionNumber}
                  </div>

                  {edition.year === 2026 && (
                    <div className="bg-white p-2 rounded-lg shadow inline-block mt-2">
                      <div className="relative h-9 w-40">
                        <Image
                          src="/images/jalsa72-logo.jpg"
                          alt="72nd Jalsa Salana Nigeria 2026 Official Logo"
                          fill
                          className="object-contain"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Theme & Details (6 cols) */}
                <div className="lg:col-span-6 space-y-2">
                  <h2 className={`font-serif font-bold text-lg sm:text-xl leading-snug ${edition.isCurrent ? 'text-white' : 'text-charcoal'}`}>
                    {edition.themeEnglish}
                  </h2>

                  <div className={`flex flex-wrap items-center gap-4 text-xs pt-1 ${edition.isCurrent ? 'text-gray-300' : 'text-gray-500'}`}>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-gold-dark" />
                      {edition.dates}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-gold-dark" />
                      {edition.venue}
                    </span>
                    {edition.attendance && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-gold-dark" />
                          {edition.attendance}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Counts & Action (3 cols) */}
                <div className="lg:col-span-3 flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-4">
                  <div className={`text-xs space-y-1 ${edition.isCurrent ? 'text-gray-300' : 'text-gray-500'}`}>
                    <div><strong>{edition.articlesCount || 0}</strong> Articles &amp; Reports</div>
                    <div><strong>{edition.speechesCount || 0}</strong> Speeches &amp; Addresses</div>
                    <div><strong>{edition.galleriesCount || 0}</strong> Photo Albums</div>
                  </div>

                  <Link
                    href={`/editions/${edition.year}`}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-colors ${
                      edition.isCurrent
                        ? 'bg-gold hover:bg-gold-hover text-primary-950 shadow'
                        : 'bg-primary hover:bg-primary-dark text-white'
                    }`}
                  >
                    <span>Explore Archive</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
