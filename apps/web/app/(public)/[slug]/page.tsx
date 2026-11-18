import React from 'react';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import { getPageBySlug, getArticleBySlug } from '@/lib/api';
import { 
  Calendar, 
  Shield, 
  Truck, 
  Home as HomeIcon, 
  PhoneCall, 
  ChevronRight, 
  FileText,
  Clock
} from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await getPageBySlug(slug);
    const page = res.data;
    if (page) {
      return {
        title: `${page.title} — Jalsa Salana Nigeria`,
        description: page.metaDescription || page.excerpt || `${page.title} - Official information from Jalsa Salana Nigeria.`,
        openGraph: {
          title: `${page.title} — Jalsa Salana Nigeria`,
          description: page.metaDescription || page.excerpt || `${page.title} - Official documentation from Jalsa Salana Nigeria.`,
          images: page.featuredImage ? [page.featuredImage] : ['/images/jalsa72-official-logo.jpg'],
        },
      };
    }
  } catch {
    // Check if article slug exists for fallback
    try {
      const artRes = await getArticleBySlug(slug);
      if (artRes?.data) {
        return {
          title: `${artRes.data.title} — Jalsa Salana Nigeria`,
          description: artRes.data.subtitle || artRes.data.excerpt || '',
        };
      }
    } catch {}
  }
  return { title: 'Page Not Found — Jalsa Salana Nigeria' };
}

export default async function DynamicSlugPage({ params }: PageProps) {
  const { slug } = await params;

  let pageData: any = null;
  let articleRedirectSlug: string | null = null;

  try {
    const res = await getPageBySlug(slug);
    pageData = res.data;
  } catch {
    try {
      const artRes = await getArticleBySlug(slug);
      if (artRes?.data?.slug) {
        articleRedirectSlug = artRes.data.slug;
      }
    } catch {}
  }

  if (articleRedirectSlug) {
    redirect(`/articles/${articleRedirectSlug}`);
  }

  if (!pageData) {
    try {
      const artRes = await getArticleBySlug(slug);
      if (artRes?.data?.slug) {
        articleRedirectSlug = artRes.data.slug;
      }
    } catch {}
    if (articleRedirectSlug) {
      redirect(`/articles/${articleRedirectSlug}`);
    }
    notFound();
  }

  // Related event pages for attendee sidebar
  const eventLinks = [
    { title: 'Registration Hub 2026', slug: '/registration', icon: Calendar, highlight: true },
    { title: 'Programme of Events', slug: '/programme-of-events-jalsa-salana-nigeria-2024', icon: FileText },
    { title: 'Accommodation Arrangements', slug: '/accommodation', icon: HomeIcon },
    { title: 'Transportation & Routes', slug: '/transportation', icon: Truck },
    { title: 'Security & Protocol Guidelines', slug: '/security', icon: Shield },
    { title: 'Health & Emergency Info', slug: '/info-emergency', icon: PhoneCall },
  ];

  return (
    <div className="min-h-screen bg-surface-bg py-10 sm:py-16">
      {/* Top Breadcrumb Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <nav className="flex items-center gap-2 text-xs text-ink-muted font-medium">
          <Link href="/" className="hover:text-teal transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-surface-border" />
          <span className="text-ink-muted">Official Information</span>
          <ChevronRight className="w-3.5 h-3.5 text-surface-border" />
          <span className="text-teal font-bold truncate max-w-xs sm:max-w-md">
            {pageData.title}
          </span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Main Article/Page Body (8 Cols) */}
          <main className="lg:col-span-8 bg-white border border-surface-border/60 rounded-3xl p-7 sm:p-12 shadow-soft">
            {/* Header / Meta */}
            <div className="border-b border-surface-border/40 pb-8 mb-10">
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-teal-50 text-teal border border-teal-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse"></span>
                  Official Documentation
                </span>
                {pageData.sourceSite && (
                  <span className="text-[11px] text-ink-muted font-mono">
                    Source: {pageData.sourceSite}
                  </span>
                )}
              </div>

              <h1 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-forest leading-tight">
                {pageData.title}
              </h1>

              {pageData.excerpt && (
                <p className="mt-4 text-base sm:text-lg text-ink-muted font-sans leading-relaxed italic border-l-2 border-teal pl-4 bg-teal-50/40 py-2.5 rounded-r-xl">
                  {pageData.excerpt}
                </p>
              )}

              <div className="flex items-center justify-between text-xs text-ink-muted mt-6 pt-5 border-t border-surface-border/40">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-teal" />
                    Updated: {new Date(pageData.updatedAt || pageData.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] bg-surface-muted text-ink-body px-3 py-1 rounded-lg font-mono">
                    Official Release
                  </span>
                </div>
              </div>
            </div>

            {/* Optional Featured Image */}
            {pageData.featuredImage && (
              <div className="relative w-full h-64 sm:h-96 rounded-2xl overflow-hidden mb-10 shadow-soft border border-surface-border/40">
                <Image
                  src={pageData.featuredImage}
                  alt={pageData.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Content Body with Enhanced Typography */}
            <div 
              className="prose prose-lg max-w-none text-ink-body leading-relaxed
                prose-headings:font-display prose-headings:text-forest prose-headings:font-bold
                prose-h2:text-2xl prose-h2:border-b prose-h2:border-surface-border/40 prose-h2:pb-3 prose-h2:mt-10
                prose-h3:text-xl prose-h3:mt-8
                prose-p:text-base sm:prose-p:text-[17px] prose-p:leading-relaxed
                prose-a:text-teal prose-a:font-semibold prose-a:underline hover:prose-a:text-forest
                prose-blockquote:border-teal prose-blockquote:bg-teal-50 prose-blockquote:text-forest prose-blockquote:py-3 prose-blockquote:px-5 prose-blockquote:rounded-r-xl
                prose-ul:list-disc prose-ol:list-decimal
                prose-img:rounded-2xl prose-img:shadow-soft prose-img:mx-auto"
              dangerouslySetInnerHTML={{ __html: pageData.content }}
            />

            {/* Bottom Call to Action: Attendee Support */}
            <div className="mt-14 pt-8 border-t border-surface-border/60 bg-surface-muted/50 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h4 className="font-display font-bold text-base text-forest">
                  Need Help or Have Inquiries?
                </h4>
                <p className="text-xs text-ink-muted mt-1 font-sans">
                  Our Jalsa Salana Nigeria Central Planning Committee &amp; Info Desk is available 24/7.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/registration"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-teal hover:bg-teal-600 text-white font-bold text-xs shadow-glow-teal transition-all"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Register for 2026</span>
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-surface-border/80 hover:border-teal text-ink-body text-xs font-semibold shadow-soft transition-colors"
                >
                  <span>Contact Desk</span>
                </Link>
              </div>
            </div>
          </main>

          {/* Sidebar (4 Cols) */}
          <aside className="lg:col-span-4 space-y-6">
            
            {/* 72nd Jalsa Registration Box */}
            <div className="bg-forest text-white p-7 sm:p-8 rounded-3xl shadow-soft border border-teal/20">
              <span className="text-[10px] font-display uppercase font-bold tracking-[0.2em] text-lime block mb-1">
                Annual Convention 2026
              </span>
              <h3 className="font-display font-extrabold text-xl text-white">
                72nd Jalsa Salana Nigeria
              </h3>
              <p className="text-xs text-white/70 mt-2 font-sans leading-relaxed">
                Pre-registration is mandatory for all delegates, guests, and families attending the 72nd convention at Jamia Ahmadiyya Ilaro.
              </p>
              <div className="mt-5 pt-4 border-t border-white/10">
                <Link
                  href="/registration"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-teal hover:bg-teal-500 text-white font-bold text-xs uppercase tracking-wider transition-transform hover:scale-[1.02] shadow-glow-teal"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Complete Online Registration</span>
                </Link>
              </div>
            </div>

            {/* Event Directory Navigation */}
            <div className="bg-white border border-surface-border/60 rounded-3xl p-7 shadow-soft">
              <h3 className="font-display font-bold text-xs uppercase tracking-[0.2em] text-forest mb-5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal"></span>
                <span>Attendee Information Hub</span>
              </h3>
              <ul className="space-y-1.5 text-xs">
                {eventLinks.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.slug.includes(slug);
                  return (
                    <li key={item.title}>
                      <Link
                        href={item.slug}
                        className={`flex items-center justify-between p-3 rounded-2xl font-medium transition-all ${
                          isActive
                            ? 'bg-teal-50 text-teal font-bold border border-teal-200'
                            : 'text-ink-body hover:bg-surface-bg hover:text-teal'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-teal' : 'text-ink-muted'}`} />
                          <span>{item.title}</span>
                        </div>
                        {item.highlight && !isActive && (
                          <span className="text-[9px] bg-teal-50 text-teal px-2 py-0.5 rounded-full font-bold uppercase">
                            Open
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
