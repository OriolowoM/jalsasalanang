import React from 'react';
import Link from 'next/link';
import { Mic, Video, FileText, ArrowRight } from 'lucide-react';

interface Props {
  speeches: any[];
}

export default function SpeechesSection({ speeches = [] }: Props) {
  if (speeches.length === 0) return null;

  return (
    <section className="py-14 sm:py-16 bg-white border-b border-surface-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3.5 mb-8 border-b-2 border-primary gap-3">
          <div>
            <div className="flex items-center gap-2.5">
              <Mic className="w-5 h-5 text-gold-metallic" />
              <h2 className="font-display font-black text-2xl sm:text-3xl text-charcoal-heading tracking-tight">
                Speeches, Sermons &amp; Keynote Addresses
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 font-serif">
              Authoritative transcripts and recordings of caliphal addresses, presidential remarks, and theological discourses.
            </p>
          </div>
          <Link
            href="/speeches"
            className="text-xs font-cinzel font-black uppercase tracking-[0.2em] text-gold-dark hover:text-primary flex items-center gap-1 flex-shrink-0 transition-colors"
          >
            <span>All Speeches Archive</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {speeches.slice(0, 3).map((speech: any) => (
            <div
              key={speech.id}
              className="p-6 sm:p-7 rounded-2xl border border-gray-200/80 bg-surface-bg hover:bg-white hover:border-gold/60 hover:shadow-prestige hover:-translate-y-1.5 transition-all duration-500 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3.5">
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider border border-primary/20">
                    {speech.speechType || 'Keynote'}
                  </span>
                  {speech.edition && (
                    <span className="text-[11px] font-bold text-gold-dark bg-gold/10 px-2.5 py-0.5 rounded-full border border-gold/30">
                      Jalsa {speech.edition.year}
                    </span>
                  )}
                </div>

                <Link href={`/speeches/${speech.slug}`}>
                  <h3 className="font-display font-bold text-lg text-charcoal group-hover:text-primary transition-colors leading-snug mb-2.5">
                    {speech.title}
                  </h3>
                </Link>

                <div className="mb-3.5 pb-2 border-b border-gray-200/60">
                  <div className="text-sm font-bold text-primary-dark">{speech.speakerName}</div>
                  {speech.speakerTitle && (
                    <div className="text-xs text-gray-500 line-clamp-1 font-serif">{speech.speakerTitle}</div>
                  )}
                </div>

                {speech.summary && (
                  <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed mb-4 font-serif">
                    {speech.summary}
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-gray-200/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 text-gray-500">
                  {speech.videoUrl && (
                    <span className="flex items-center gap-1 text-[11px] text-red-600 font-semibold bg-red-50 px-2 py-0.5 rounded border border-red-200">
                      <Video className="w-3.5 h-3.5" /> Video
                    </span>
                  )}
                  {speech.audioUrl && (
                    <span className="flex items-center gap-1 text-[11px] text-primary font-semibold bg-primary-50 px-2 py-0.5 rounded border border-primary-200">
                      <Mic className="w-3.5 h-3.5" /> Audio
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-[11px] text-gray-600 font-medium">
                    <FileText className="w-3.5 h-3.5" /> Transcript
                  </span>
                </div>

                <Link
                  href={`/speeches/${speech.slug}`}
                  className="font-bold text-primary group-hover:text-gold-dark transition-colors inline-flex items-center gap-1"
                >
                  <span>Read</span>
                  <span>&rarr;</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
