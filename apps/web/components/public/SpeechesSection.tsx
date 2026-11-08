import React from 'react';
import Link from 'next/link';
import { Mic, Video, FileText, ArrowRight } from 'lucide-react';

interface Props {
  speeches: any[];
}

export default function SpeechesSection({ speeches = [] }: Props) {
  if (speeches.length === 0) return null;

  return (
    <section className="py-12 bg-white border-b border-surface-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 mb-8 border-b-2 border-primary gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Mic className="w-5 h-5 text-primary" />
              <h2 className="font-serif font-black text-2xl sm:text-3xl text-charcoal-heading">
                Speeches, Sermons &amp; Keynote Addresses
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Authoritative transcripts and recordings of caliphal addresses, presidential remarks, and theological discourses.
            </p>
          </div>
          <Link
            href="/speeches"
            className="text-xs font-bold uppercase tracking-wider text-gold-dark hover:text-primary flex items-center gap-1 flex-shrink-0"
          >
            All Speeches Archive <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {speeches.slice(0, 3).map((speech: any) => (
            <div
              key={speech.id}
              className="p-6 rounded-xl border border-gray-100 bg-surface-bg hover:border-primary/30 transition-all flex flex-col justify-between shadow-sm hover:shadow"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                    {speech.speechType || 'Keynote'}
                  </span>
                  {speech.edition && (
                    <span className="text-[10px] font-semibold text-gray-400">
                      Jalsa {speech.edition.year}
                    </span>
                  )}
                </div>

                <Link href={`/speeches/${speech.slug}`}>
                  <h3 className="font-serif font-bold text-lg text-charcoal hover:text-primary transition-colors leading-snug mb-2">
                    {speech.title}
                  </h3>
                </Link>

                <div className="mb-3">
                  <div className="text-sm font-bold text-primary-dark">{speech.speakerName}</div>
                  {speech.speakerTitle && (
                    <div className="text-xs text-gray-500 line-clamp-1">{speech.speakerTitle}</div>
                  )}
                </div>

                {speech.summary && (
                  <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed mb-4">
                    {speech.summary}
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-gray-200/60 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 text-gray-500">
                  {speech.videoUrl && (
                    <span className="flex items-center gap-1 text-[11px] text-red-600 font-medium">
                      <Video className="w-3.5 h-3.5" /> Video
                    </span>
                  )}
                  {speech.audioUrl && (
                    <span className="flex items-center gap-1 text-[11px] text-primary font-medium">
                      <Mic className="w-3.5 h-3.5" /> Audio
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-[11px] text-gray-600 font-medium">
                    <FileText className="w-3.5 h-3.5" /> Transcript
                  </span>
                </div>

                <Link
                  href={`/speeches/${speech.slug}`}
                  className="font-bold text-primary hover:text-primary-dark inline-flex items-center gap-0.5"
                >
                  Read &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
