import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Clock, Calendar, ArrowLeft, ArrowRight, Share2, Tag, ChevronRight, Award, BookOpen } from 'lucide-react';
import { getArticleBySlug } from '@/lib/api';
import TableOfContents from '@/components/public/TableOfContents';
import SocialShareButtons from '@/components/public/SocialShareButtons';
import ArticleAudioPlayer from '@/components/public/ArticleAudioPlayer';
import ReadingProgressBar from '@/components/public/ReadingProgressBar';
import LocalizedArticleContent from '@/components/public/LocalizedArticleContent';
import { getArticleFeaturedImage } from '@/lib/article-images';

interface ArticleDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ArticleDetailPageProps) {
  const { slug } = await params;
  try {
    const res = await getArticleBySlug(slug);
    const article = res.data;
    if (!article) return {};

    return {
      title: article.metaTitle || article.title,
      description: article.metaDescription || article.subtitle || article.excerpt,
      openGraph: {
        title: article.title,
        description: article.subtitle || article.excerpt,
        images: article.featuredImage ? [{ url: article.featuredImage }] : [],
        type: 'article',
        publishedTime: article.publishedAt,
        authors: [article.author?.name || 'Ahmadiyya Muslim Jama\'at Nigeria'],
      },
    };
  } catch {
    return {};
  }
}

export default async function ArticleDetailPage({ params }: ArticleDetailPageProps) {
  const { slug } = await params;
  let article: any;
  try {
    const res = await getArticleBySlug(slug);
    article = res.data;
  } catch (err) {
    notFound();
  }

  if (!article) notFound();

  const featuredHeroImage = getArticleFeaturedImage(article);

  // JSON-LD Schema.org Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.subtitle || article.excerpt,
    image: [`https://jalsasalana.ng${featuredHeroImage}`],
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: [{
      '@type': 'Person',
      name: article.author?.name || 'Editorial Board',
      jobTitle: article.author?.title || '',
    }],
    publisher: {
      '@type': 'Organization',
      name: 'Jalsa Salana Nigeria',
      logo: {
        '@type': 'ImageObject',
        url: 'https://jalsasalana.ng/images/jalsa-logo.png',
      },
    },
  };

  return (
    <article className="py-10 sm:py-16 bg-surface-bg min-h-screen">
      {/* Schema.org injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-ink-muted mb-8 font-medium">
          <Link href="/" className="hover:text-teal transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-surface-border" />
          <Link href="/articles" className="hover:text-teal transition-colors">Articles</Link>
          {article.categories?.[0] && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-surface-border" />
              <Link href={`/categories/${article.categories[0].slug}`} className="hover:text-forest transition-colors text-teal font-bold">
                {article.categories[0].name}
              </Link>
            </>
          )}
        </nav>

        {/* Header Metadata & Headline */}
        <header className="mb-10">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {article.categories?.map((cat: any) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="px-3.5 py-1 rounded-full bg-teal-50 text-teal text-xs font-bold uppercase tracking-wider border border-teal-200 hover:bg-teal hover:text-white transition-colors"
              >
                {cat.name}
              </Link>
            ))}
            {article.edition && (
              <Link
                href={`/editions/${article.edition.year}`}
                className="px-3 py-1 rounded-full bg-lime/20 text-forest text-xs font-bold uppercase tracking-wider border border-lime/40 hover:bg-lime transition-colors"
              >
                {article.edition.editionNumber || article.edition.year}
              </Link>
            )}
          </div>

          <h1 className="font-display font-extrabold text-display-lg text-forest leading-[1.12] mb-5 tracking-tight">
            {article.title}
          </h1>

          {article.subtitle && (
            <p className="text-lg sm:text-xl text-ink-muted leading-relaxed mb-8 border-l-2 border-teal pl-5 font-sans italic">
              {article.subtitle}
            </p>
          )}

          {/* Author Byline & Date Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-5 border-y border-surface-border/60">
            <div className="flex items-center gap-3.5">
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-teal-50 flex-shrink-0 ring-2 ring-teal/20 shadow-soft">
                <Image
                  src={article.author?.avatar || '/images/jalsa-crest.png'}
                  alt={article.author?.name || 'Author'}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="font-bold text-sm text-ink-heading">
                  {article.author?.name || 'Editorial Board'}
                </div>
                {article.author?.title && (
                  <div className="text-xs text-ink-muted line-clamp-1">{article.author.title}</div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-ink-muted font-medium">
              <span className="flex items-center gap-1.5 text-ink-body">
                <Calendar className="w-3.5 h-3.5 text-teal" />
                {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'October 2026'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-teal font-semibold">
                <Clock className="w-3.5 h-3.5" />
                {article.readingTime || 5} min read
              </span>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        <div className="mb-12">
          <div className="relative aspect-[16/9] rounded-3xl overflow-hidden bg-surface-muted shadow-soft ring-1 ring-black/5">
            <Image
              src={featuredHeroImage}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="text-xs text-ink-muted mt-2 text-right italic font-sans">
            Photo Credit: {article.imageCredit || 'Jalsa Salana Nigeria Photographic Archives'}
          </div>
        </div>

        {/* AI Voice Speech Audio Player */}
        <ArticleAudioPlayer title={article.title} content={article.content} />

        {/* Reading Progress Indicator & Floating Tools */}
        <ReadingProgressBar title={article.title} />

        {/* Layout: Sticky Table of Contents & Article Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Main Body (8 cols on desktop) */}
          <div className="lg:col-span-8">
            {/* Dynamic Table of Contents */}
            <TableOfContents content={article.content} />

            {/* Rich Text Body with Multilingual Crossfading & Drop Cap */}
            <LocalizedArticleContent
              articleId={article.id}
              initialTitle={article.title}
              initialSubtitle={article.subtitle}
              initialContent={article.content}
              initialTranslations={article.translations || []}
            />

            {/* Tags */}
            {article.tags?.length > 0 && (
              <div className="pt-8 mt-12 border-t border-surface-border/60">
                <div className="flex items-center gap-2 flex-wrap">
                  <Tag className="w-4 h-4 text-ink-muted" />
                  <span className="text-xs font-bold uppercase tracking-wider text-ink-muted mr-1">Tags:</span>
                  {article.tags.map((t: any) => (
                    <span
                      key={t.id}
                      className="px-3 py-1 rounded-lg bg-surface-muted text-ink-body text-xs hover:bg-teal-50 hover:text-teal transition-colors font-medium"
                    >
                      #{t.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Social Share Bar */}
            <div className="py-6 my-10 border-y border-surface-border/60 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-forest flex items-center gap-2">
                <Share2 className="w-4 h-4 text-teal" /> Share this Article
              </span>
              <SocialShareButtons title={article.title} />
            </div>

            {/* Author Biography Box */}
            {article.author && (
              <div className="p-7 sm:p-8 rounded-3xl bg-white border border-surface-border/60 shadow-soft flex flex-col sm:flex-row items-start gap-6 my-10">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-teal-50 flex-shrink-0 ring-2 ring-teal/20 shadow-soft">
                  <Image
                    src={article.author.avatar || '/images/jalsa-crest.png'}
                    alt={article.author.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-bold text-base text-forest">{article.author.name}</span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-teal-50 text-teal border border-teal-200">
                      <Award className="w-3 h-3 text-teal" /> Official Contributor
                    </span>
                  </div>
                  {article.author.title && (
                    <div className="text-xs text-teal font-semibold">{article.author.title}</div>
                  )}
                  <p className="text-xs text-ink-muted leading-relaxed pt-1 font-sans">
                    {article.author.bio || 'Contributing scholar and author on Islamic jurisprudence, African history, and divine guidance under Khilafat-e-Ahmadiyya.'}
                  </p>
                  <div className="pt-2">
                    <Link
                      href={`/articles?search=${encodeURIComponent(article.author.name)}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-teal hover:text-forest transition-colors"
                    >
                      <BookOpen className="w-3.5 h-3.5" /> View all articles by {article.author.name} &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* Prev / Next Article Navigation */}
            <nav className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-10 pt-4">
              {article.previousArticle ? (
                <Link
                  href={`/articles/${article.previousArticle.slug}`}
                  className="p-5 rounded-2xl border border-surface-border/60 hover:border-teal/40 transition-all bg-white group flex flex-col justify-between shadow-soft"
                >
                  <div className="text-[11px] font-bold text-ink-muted uppercase tracking-wider flex items-center gap-1.5">
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform text-teal" /> Previous Story
                  </div>
                  <div className="font-display font-bold text-sm text-forest group-hover:text-teal mt-2 line-clamp-2 transition-colors">
                    {article.previousArticle.title}
                  </div>
                </Link>
              ) : <div />}

              {article.nextArticle ? (
                <Link
                  href={`/articles/${article.nextArticle.slug}`}
                  className="p-5 rounded-2xl border border-surface-border/60 hover:border-teal/40 transition-all bg-white group flex flex-col justify-between text-right shadow-soft"
                >
                  <div className="text-[11px] font-bold text-ink-muted uppercase tracking-wider flex items-center justify-end gap-1.5">
                    Next Story <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-teal" />
                  </div>
                  <div className="font-display font-bold text-sm text-forest group-hover:text-teal mt-2 line-clamp-2 transition-colors">
                    {article.nextArticle.title}
                  </div>
                </Link>
              ) : <div />}
            </nav>
          </div>

          {/* Sidebar (4 cols on desktop): Related Articles */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-surface-border/60 shadow-soft">
              <h3 className="font-display font-bold text-base text-forest pb-3 mb-5 border-b border-surface-border/40">
                Related Editorial Coverage
              </h3>
              <div className="space-y-4">
                {article.relatedArticles?.map((rel: any) => (
                  <Link
                    key={rel.id}
                    href={`/articles/${rel.slug}`}
                    className="block group py-2"
                  >
                    <div className="text-[10px] font-bold uppercase tracking-wider text-teal mb-1">
                      {rel.categories?.[0]?.name || 'Feature'}
                    </div>
                    <h4 className="font-display font-bold text-sm text-ink-heading group-hover:text-teal transition-colors leading-snug">
                      {rel.title}
                    </h4>
                    <div className="text-[11px] text-ink-muted mt-1.5">
                      By {rel.author?.name}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-teal-50 p-6 rounded-3xl border border-teal-200">
              <h3 className="font-display font-bold text-xs uppercase tracking-wider text-forest mb-1.5">
                Jalsa Salana 2026 Archive
              </h3>
              <p className="text-xs text-ink-muted mb-4 font-sans leading-relaxed">
                Review official guidelines, transport advisories, and the convention schedule for the 72nd convention in Ilaro.
              </p>
              <Link
                href="/editions/2026"
                className="text-xs font-bold text-teal hover:text-forest flex items-center gap-1 transition-colors"
              >
                <span>Access Jalsa 2026 Hub</span>
                <span>&rarr;</span>
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
}
