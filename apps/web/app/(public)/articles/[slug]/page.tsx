import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Clock, Calendar, User, ArrowLeft, ArrowRight, Share2, Tag, ChevronRight } from 'lucide-react';
import { getArticleBySlug } from '@/lib/api';
import TableOfContents from '@/components/public/TableOfContents';
import SocialShareButtons from '@/components/public/SocialShareButtons';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const res = await getArticleBySlug(params.slug);
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

export default async function ArticleDetailPage({ params }: { params: { slug: string } }) {
  let article: any;
  try {
    const res = await getArticleBySlug(params.slug);
    article = res.data;
  } catch (err) {
    notFound();
  }

  if (!article) notFound();

  // JSON-LD Schema.org Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.subtitle || article.excerpt,
    image: article.featuredImage ? [`https://jalsasalana.ng${article.featuredImage}`] : [],
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
    <article className="py-8 sm:py-12 bg-surface-bg">
      {/* Schema.org injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6 font-medium">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 text-gray-300" />
          <Link href="/articles" className="hover:text-primary transition-colors">Articles</Link>
          {article.categories?.[0] && (
            <>
              <ChevronRight className="w-3 h-3 text-gray-300" />
              <Link href={`/categories/${article.categories[0].slug}`} className="hover:text-primary transition-colors text-primary font-bold">
                {article.categories[0].name}
              </Link>
            </>
          )}
        </nav>

        {/* Header Metadata & Headline */}
        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {article.categories?.map((cat: any) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="px-3 py-1 rounded-full bg-primary-subtle text-primary text-xs font-bold uppercase tracking-wider border border-primary-100 hover:bg-primary hover:text-white transition-colors"
              >
                {cat.name}
              </Link>
            ))}
            {article.edition && (
              <Link
                href={`/editions/${article.edition.year}`}
                className="px-2.5 py-1 rounded-full bg-gold-subtle text-gold-dark text-xs font-bold uppercase tracking-wider border border-gold/30 hover:bg-gold hover:text-primary-950 transition-colors"
              >
                {article.edition.editionNumber || article.edition.year}
              </Link>
            )}
          </div>

          <h1 className="font-serif font-black text-3xl sm:text-4xl lg:text-5xl text-charcoal-heading leading-[1.18] mb-4">
            {article.title}
          </h1>

          {article.subtitle && (
            <p className="font-serif italic text-lg sm:text-xl text-gray-600 leading-relaxed mb-6 border-l-2 border-gold pl-4">
              {article.subtitle}
            </p>
          )}

          {/* Author Byline & Date Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-gray-200">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-full overflow-hidden bg-primary/10 flex-shrink-0">
                <Image
                  src={article.author?.avatar || '/images/jalsa-crest.png'}
                  alt={article.author?.name || 'Author'}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <div className="font-bold text-sm text-charcoal">
                  {article.author?.name || 'Editorial Board'}
                </div>
                {article.author?.title && (
                  <div className="text-xs text-gray-500 line-clamp-1">{article.author.title}</div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-400 font-medium">
              <span className="flex items-center gap-1 text-gray-600">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'October 2026'}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-gray-600">
                <Clock className="w-3.5 h-3.5 text-gold-dark" />
                {article.readingTime || 5} min read
              </span>
            </div>
          </div>
        </header>

        {/* Featured Image */}
        {article.featuredImage && (
          <div className="mb-10">
            <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-gray-100 shadow-sm">
              <Image
                src={article.featuredImage}
                alt={article.title}
                fill
                className="object-cover"
                priority
              />
            </div>
            {article.imageCredit && (
              <div className="text-xs text-gray-500 mt-2 text-right italic">
                {article.imageCredit}
              </div>
            )}
          </div>
        )}

        {/* Layout: Sticky Table of Contents & Article Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Body (8 cols on desktop) */}
          <div className="lg:col-span-8">
            {/* Dynamic Table of Contents */}
            <TableOfContents content={article.content} />

            {/* Rich Text Body */}
            <div
              className="prose prose-lg max-w-none text-charcoal font-serif text-[17px] sm:text-[18px] leading-[1.85]"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Tags */}
            {article.tags?.length > 0 && (
              <div className="pt-8 mt-10 border-t border-gray-200">
                <div className="flex items-center gap-2 flex-wrap">
                  <Tag className="w-4 h-4 text-gray-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500 mr-1">Tags:</span>
                  {article.tags.map((t: any) => (
                    <span
                      key={t.id}
                      className="px-2.5 py-1 rounded bg-gray-100 text-gray-700 text-xs hover:bg-primary-subtle hover:text-primary transition-colors"
                    >
                      #{t.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Social Share Bar */}
            <div className="py-6 my-8 border-y border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-charcoal flex items-center gap-1.5">
                <Share2 className="w-4 h-4 text-primary" /> Share this Article
              </span>
              <SocialShareButtons title={article.title} />
            </div>

            {/* Author Biography Box */}
            {article.author && (
              <div className="p-6 rounded-xl bg-white border border-gray-200 shadow-sm flex flex-col sm:flex-row items-start gap-4 my-8">
                <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                  <Image
                    src={article.author.avatar || '/images/jalsa-crest.png'}
                    alt={article.author.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-1">
                  <div className="font-bold text-base text-charcoal">{article.author.name}</div>
                  <div className="text-xs text-gold-dark font-semibold">{article.author.title}</div>
                  <p className="text-xs text-gray-600 leading-relaxed pt-1">
                    {article.author.bio || 'Contributing scholar and author on Islamic jurisprudence, African history, and divine guidance under Khilafat-e-Ahmadiyya.'}
                  </p>
                </div>
              </div>
            )}

            {/* Prev / Next Article Navigation */}
            <nav className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8 pt-4">
              {article.previousArticle ? (
                <Link
                  href={`/articles/${article.previousArticle.slug}`}
                  className="p-4 rounded-lg border border-gray-200 hover:border-primary transition-all bg-white group flex flex-col justify-between"
                >
                  <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> Previous Story
                  </div>
                  <div className="font-serif font-bold text-sm text-charcoal group-hover:text-primary mt-1 line-clamp-2">
                    {article.previousArticle.title}
                  </div>
                </Link>
              ) : <div />}

              {article.nextArticle ? (
                <Link
                  href={`/articles/${article.nextArticle.slug}`}
                  className="p-4 rounded-lg border border-gray-200 hover:border-primary transition-all bg-white group flex flex-col justify-between text-right"
                >
                  <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center justify-end gap-1">
                    Next Story <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <div className="font-serif font-bold text-sm text-charcoal group-hover:text-primary mt-1 line-clamp-2">
                    {article.nextArticle.title}
                  </div>
                </Link>
              ) : <div />}
            </nav>
          </div>

          {/* Sidebar (4 cols on desktop): Related Articles */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="font-serif font-bold text-base text-charcoal pb-3 mb-4 border-b border-gray-100">
                Related Editorial Coverage
              </h3>
              <div className="space-y-4">
                {article.relatedArticles?.map((rel: any) => (
                  <Link
                    key={rel.id}
                    href={`/articles/${rel.slug}`}
                    className="block group"
                  >
                    <div className="text-[10px] font-bold uppercase tracking-wider text-primary mb-1">
                      {rel.categories?.[0]?.name || 'Feature'}
                    </div>
                    <h4 className="font-serif font-bold text-sm text-charcoal group-hover:text-primary transition-colors leading-snug">
                      {rel.title}
                    </h4>
                    <div className="text-[11px] text-gray-400 mt-1">
                      By {rel.author?.name}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-primary-subtle p-5 rounded-xl border border-primary-200">
              <h3 className="font-bold text-xs uppercase tracking-wider text-primary-dark mb-1">
                Jalsa Salana 2026 Archive
              </h3>
              <p className="text-xs text-gray-600 mb-3">
                Review official guidelines, transport advisories, and the convention schedule for the 72nd convention in Ilaro.
              </p>
              <Link
                href="/editions/2026"
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                Access Jalsa 2026 Hub &rarr;
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
}
