import React from 'react';
import Link from 'next/link';
import { Mic, Video, FileText, ArrowRight } from 'lucide-react';

interface Props {
  speeches: any[];
}

export default function SpeechesSection({ speeches = [] }: Props) {
  if (speeches.length === 0) return null;

  return (
    <section className="py-20 sm:py-28 bg-white border-b border-surface-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 mb-10 border-b border-teal/20 gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <Mic className="w-5 h-5 text-teal" />
              <h2 className="font-display font-extrabold text-display-md text-forest tracking-tight">
                Speeches, Sermons &amp; Keynote Addresses
              </h2>
            </div>
            <p className="text-sm text-ink-muted font-sans">
              Authoritative transcripts and recordings of caliphal addresses, presidential remarks, and theological discourses.
            </p>
          </div>
          <Link
            href="/speeches"
            className="text-xs font-display font-bold uppercase tracking-[0.2em] text-teal hover:text-forest flex items-center gap-1.5 flex-shrink-0 transition-colors"
          >
            <span>All Speeches Archive</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {speeches.slice(0, 3).map((speech: any, idx: number) => (
            <div
              key={speech.id}
              className={`p-7 sm:p-8 rounded-3xl border border-surface-border/60 bg-surface-bg hover:bg-white hover:border-teal/30 hover:shadow-soft-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group ${
                idx % 2 === 1 ? 'md:translate-y-2' : ''
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full bg-teal-50 text-teal text-[10px] font-bold uppercase tracking-wider border border-teal-200">
                    {speech.speechType || 'Keynote'}
                  </span>
                  {speech.edition && (
                    <span className="text-[11px] font-bold text-forest bg-lime/30 px-3 py-0.5 rounded-full border border-lime/50">
                      Jalsa {speech.edition.year}
                    </span>
                  )}
                </div>

                <Link href={`/speeches/${speech.slug}`}>
                  <h3 className="font-display font-bold text-lg text-forest group-hover:text-teal transition-colors leading-snug mb-3">
                    {speech.title}
                  </h3>
                </Link>

                <div className="mb-4 pb-3 border-b border-surface-border/40">
                  <div className="text-sm font-bold text-ink-heading">{speech.speakerName}</div>
                  {speech.speakerTitle && (
                    <div className="text-xs text-ink-muted line-clamp-1 font-sans mt-0.5">{speech.speakerTitle}</div>
                  )}
                </div>

                {speech.summary && (
                  <p className="text-xs text-ink-muted line-clamp-3 leading-relaxed mb-4 font-sans">
                    {speech.summary}
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-surface-border/40 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5 text-ink-muted">
                  {speech.videoUrl && (
                    <span className="flex items-center gap-1 text-[11px] text-red-600 font-semibold bg-red-50 px-2 py-0.5 rounded-md border border-red-200">
                      <Video className="w-3.5 h-3.5" /> Video
                    </span>
                  )}
                  {speech.audioUrl && (
                    <span className="flex items-center gap-1 text-[11px] text-teal font-semibold bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                      <Mic className="w-3.5 h-3.5" /> Audio
                    </span>
                  )}
                  <span className="flex items-center gap-1 text-[11px] text-ink-muted font-medium">
                    <FileText className="w-3.5 h-3.5" /> Transcript
                  </span>
                </div>

                <Link
                  href={`/speeches/${speech.slug}`}
                  className="font-bold text-teal group-hover:text-forest transition-colors inline-flex items-center gap-1"
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
