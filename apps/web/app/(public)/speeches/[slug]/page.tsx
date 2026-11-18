import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSpeechBySlug } from '@/lib/api';
import { Mic, Video, FileText, Download, Calendar, User, ChevronRight, Share2 } from 'lucide-react';
import SocialShareButtons from '@/components/public/SocialShareButtons';

interface SpeechDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: SpeechDetailPageProps) {
  const { slug } = await params;
  try {
    const res = await getSpeechBySlug(slug);
    const speech = res.data;
    if (!speech) return {};

    return {
      title: `${speech.title} — ${speech.speakerName}`,
      description: speech.summary || `Full address delivered by ${speech.speakerName} at Jalsa Salana Nigeria.`,
    };
  } catch {
    return {};
  }
}

export default async function SpeechDetailPage({ params }: SpeechDetailPageProps) {
  const { slug } = await params;
  let speech: any;
  try {
    const res = await getSpeechBySlug(slug);
    speech = res.data;
  } catch {
    notFound();
  }

  if (!speech) notFound();

  return (
    <article className="py-8 sm:py-12 bg-surface-bg min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6 font-medium">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 text-gray-300" />
          <Link href="/speeches" className="hover:text-primary transition-colors">Speeches</Link>
          <ChevronRight className="w-3 h-3 text-gray-300" />
          <span className="text-primary font-bold truncate max-w-[200px]">{speech.title}</span>
        </nav>

        {/* Header */}
        <header className="mb-8 p-6 sm:p-8 rounded-2xl bg-white border border-gray-200 shadow-sm">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full bg-primary-subtle text-primary text-xs font-bold uppercase tracking-wider">
              {speech.speechType || 'Keynote Address'}
            </span>
            {speech.edition && (
              <Link
                href={`/editions/${speech.edition.year}`}
                className="px-2.5 py-1 rounded-full bg-gold-subtle text-gold-dark text-xs font-bold uppercase tracking-wider hover:underline"
              >
                Jalsa {speech.edition.year} ({speech.edition.editionNumber})
              </Link>
            )}
            {speech.session && (
              <span className="text-xs text-gray-500 font-medium">
                • {speech.session}
              </span>
            )}
          </div>

          <h1 className="font-serif font-black text-2xl sm:text-3xl lg:text-4xl text-charcoal-heading leading-tight mb-4">
            {speech.title}
          </h1>

          <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 font-bold">
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-base text-charcoal">{speech.speakerName}</div>
              {speech.speakerTitle && (
                <div className="text-xs text-gray-500">{speech.speakerTitle}</div>
              )}
            </div>
          </div>
        </header>

        {/* Media Embeds (Audio or Video) */}
        {speech.audioUrl && (
          <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center">
                <Mic className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-charcoal">Official Audio Recording</div>
                <div className="text-[11px] text-gray-400">Stream high-fidelity broadcast</div>
              </div>
            </div>
            <audio controls className="w-full sm:w-72 h-9">
              <source src={speech.audioUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}

        {/* Downloadable PDF Button if available */}
        {speech.downloadPdfUrl && (
          <div className="mb-6">
            <a
              href={speech.downloadPdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-xs font-bold uppercase tracking-wider hover:bg-primary-dark transition-colors shadow-sm"
            >
              <Download className="w-4 h-4" />
              Download Official PDF Transcript
            </a>
          </div>
        )}

        {/* Transcript Body */}
        <div className="p-6 sm:p-10 rounded-2xl bg-white border border-gray-200 shadow-sm mb-10">
          <div className="flex items-center justify-between pb-3 mb-6 border-b border-gray-100">
            <span className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
              <FileText className="w-4 h-4" /> Official Written Transcript
            </span>
            <SocialShareButtons title={speech.title} />
          </div>

          {speech.transcript ? (
            <div className="prose prose-lg max-w-none font-serif text-charcoal text-[17px] leading-relaxed whitespace-pre-line">
              {speech.transcript}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">
              Written transcript is being finalized by the editorial board.
            </p>
          )}
        </div>

        {/* Related Speeches */}
        {speech.relatedSpeeches?.length > 0 && (
          <div className="pt-6 border-t border-gray-200">
            <h3 className="font-serif font-bold text-xl text-charcoal mb-4">
              More Addresses from this Series
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {speech.relatedSpeeches.map((rel: any) => (
                <Link
                  key={rel.id}
                  href={`/speeches/${rel.slug}`}
                  className="p-4 rounded-xl bg-white border border-gray-200 hover:border-primary transition-all group"
                >
                  <div className="text-[10px] font-bold text-gold-dark mb-1">
                    Jalsa {rel.edition?.year || ''}
                  </div>
                  <h4 className="font-serif font-bold text-sm text-charcoal group-hover:text-primary transition-colors line-clamp-2">
                    {rel.title}
                  </h4>
                  <div className="text-xs text-gray-500 mt-1">{rel.speakerName}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
