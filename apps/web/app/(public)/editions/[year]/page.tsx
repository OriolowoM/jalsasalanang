import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getEditionByYear } from '@/lib/api';
import { Calendar, MapPin, Users, Mic, Camera, FileText, ChevronRight, Video } from 'lucide-react';

export async function generateMetadata({ params }: { params: { year: string } }) {
  try {
    const res = await getEditionByYear(params.year);
    const edition = res.data;
    if (!edition) return {};

    return {
      title: `${edition.year} — ${edition.editionNumber} Archive`,
      description: `${edition.themeEnglish} — Official historical records, speeches, photographs, and reports from Jalsa Salana Nigeria ${edition.year}.`,
    };
  } catch {
    return {};
  }
}

export default async function EditionDetailPage({ params }: { params: { year: string } }) {
  let edition: any;
  try {
    const res = await getEditionByYear(params.year);
    edition = res.data;
  } catch {
    notFound();
  }

  if (!edition) notFound();

  return (
    <div className="py-8 sm:py-12 bg-surface-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6 font-medium">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 text-gray-300" />
          <Link href="/editions" className="hover:text-primary transition-colors">Historical Archives</Link>
          <ChevronRight className="w-3 h-3 text-gray-300" />
          <span className="text-primary font-bold">{edition.year}</span>
        </nav>

        {/* Hero Banner for Edition */}
        <div className="p-8 sm:p-12 rounded-2xl bg-gradient-to-br from-primary-950 via-primary to-primary-900 text-white mb-12 shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-4xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/20 text-gold-light border border-gold/30 text-xs font-extrabold uppercase tracking-widest">
              {edition.editionNumber}
            </div>

            <h1 className="font-serif font-black text-3xl sm:text-5xl text-white leading-tight">
              Jalsa Salana Nigeria {edition.year}
            </h1>

            {/* Arabic Theme */}
            {edition.themeArabic && (
              <div className="font-arabic text-2xl sm:text-3xl text-gold-light pt-2 leading-relaxed" dir="rtl">
                {edition.themeArabic}
              </div>
            )}

            <p className="font-serif text-lg sm:text-xl text-gray-200 italic leading-relaxed">
              &ldquo;{edition.themeEnglish}&rdquo;
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-300 pt-3 border-t border-white/10">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-gold" />
                {edition.dates}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-gold" />
                {edition.venue}
              </span>
              {edition.attendance && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-gold" />
                    {edition.attendance}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Section 1: Speeches & Addresses Delivered at this Convention */}
        {edition.speeches?.length > 0 && (
          <section className="mb-14">
            <div className="flex items-center gap-2 pb-3 mb-6 border-b-2 border-primary">
              <Mic className="w-5 h-5 text-primary" />
              <h2 className="font-serif font-bold text-2xl text-charcoal">
                Addresses Delivered at the {edition.year} Convention
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {edition.speeches.map((sp: any) => (
                <div key={sp.id} className="p-5 rounded-xl bg-white border border-gray-200 shadow-sm flex flex-col justify-between group">
                  <div>
                    <div className="text-[10px] font-bold uppercase text-gold-dark mb-1">
                      {sp.speechType || 'Keynote'}
                    </div>
                    <Link href={`/speeches/${sp.slug}`}>
                      <h3 className="font-serif font-bold text-base text-charcoal group-hover:text-primary transition-colors leading-snug mb-2">
                        {sp.title}
                      </h3>
                    </Link>
                    <div className="text-xs font-bold text-primary mb-1">{sp.speakerName}</div>
                    {sp.summary && (
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{sp.summary}</p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 mt-4">
                    <span>{sp.session || 'Main Session'}</span>
                    <Link href={`/speeches/${sp.slug}`} className="font-bold text-primary hover:underline">
                      Transcript &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section 2: Articles & Reports from this Edition */}
        {edition.articles?.length > 0 && (
          <section className="mb-14">
            <div className="flex items-center gap-2 pb-3 mb-6 border-b-2 border-primary">
              <FileText className="w-5 h-5 text-primary" />
              <h2 className="font-serif font-bold text-2xl text-charcoal">
                Articles &amp; Reports ({edition.articles.length})
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {edition.articles.map((art: any) => (
                <article key={art.id} className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm flex flex-col justify-between group">
                  <Link href={`/articles/${art.slug}`} className="block relative aspect-[16/10] bg-gray-100">
                    <Image
                      src={art.featuredImage || '/images/jalsa-convention-a.jpg'}
                      alt={art.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>
                  <div className="p-4">
                    <Link href={`/articles/${art.slug}`}>
                      <h3 className="font-serif font-bold text-sm text-charcoal group-hover:text-primary transition-colors leading-snug line-clamp-2 mb-1">
                        {art.title}
                      </h3>
                    </Link>
                    <div className="text-[11px] text-gray-400">By {art.author?.name}</div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
