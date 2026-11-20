import React from 'react';
import Link from 'next/link';
import { getSpeeches } from '@/lib/api';
import { Mic, Video, FileText, Calendar, ArrowRight, User } from 'lucide-react';
import { constructMetadata } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'Speeches, Addresses & Friday Sermons — Jalsa Salana Nigeria',
  description:
    'Authoritative archive of caliphal addresses, presidential speeches, and theological discourses from Jalsa Salana Nigeria.',
  path: '/speeches',
});

export default async function SpeechesListingPage() {
  const res = await getSpeeches().catch(() => ({ data: [] }));
  const speeches = res.data || [];

  return (
    <div className="py-8 sm:py-12 bg-surface-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="pb-6 mb-10 border-b-2 border-primary">
          <span className="text-xs font-extrabold uppercase tracking-widest text-gold-dark block mb-1">
            Oratory &amp; Sermons
          </span>
          <h1 className="font-serif font-black text-3xl sm:text-4xl lg:text-5xl text-charcoal-heading">
            Speeches &amp; Addresses
          </h1>
          <p className="text-sm text-gray-600 mt-2 max-w-3xl leading-relaxed">
            Permanent archive of keynote addresses delivered by the Khalifatul Masih, the National Amir, central theologians, and guest dignitaries across seven decades of Jalsa Salana Nigeria.
          </p>
        </div>

        {/* Speeches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {speeches.map((sp: any) => (
            <div
              key={sp.id}
              className="p-6 rounded-xl bg-white border border-gray-200 shadow-sm flex flex-col justify-between group hover:border-primary/40 transition-all hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-primary-subtle text-primary text-[10px] font-bold uppercase tracking-wider border border-primary-100">
                    {sp.speechType || 'Keynote'}
                  </span>
                  {sp.edition && (
                    <span className="text-[10px] font-bold text-gold-dark">
                      Jalsa {sp.edition.year}
                    </span>
                  )}
                </div>

                <Link href={`/speeches/${sp.slug}`}>
                  <h2 className="font-serif font-bold text-lg text-charcoal group-hover:text-primary transition-colors leading-snug mb-3">
                    {sp.title}
                  </h2>
                </Link>

                <div className="mb-4">
                  <div className="text-sm font-bold text-primary-dark flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-gold-dark" />
                    <span>{sp.speakerName}</span>
                  </div>
                  {sp.speakerTitle && (
                    <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">{sp.speakerTitle}</div>
                  )}
                </div>

                {sp.summary && (
                  <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed mb-4">
                    {sp.summary}
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 text-gray-500">
                  {sp.videoUrl && (
                    <span className="flex items-center gap-1 text-[11px] text-red-600 font-medium">
                      <Video className="w-3.5 h-3.5" /> Video
                    </span>
                  )}
                  {sp.audioUrl && (
                    <span className="flex items-center gap-1 text-[11px] text-primary font-medium">
                      <Mic className="w-3.5 h-3.5" /> Audio
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-[11px] text-gray-600 font-medium">
                    <FileText className="w-3.5 h-3.5" /> Transcript
                  </span>
                </div>

                <Link
                  href={`/speeches/${sp.slug}`}
                  className="font-bold text-primary hover:text-primary-dark inline-flex items-center gap-1"
                >
                  Read Transcript <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
