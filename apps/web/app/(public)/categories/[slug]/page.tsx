import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getCategoryBySlug, getArticles } from '@/lib/api';
import { Clock, Calendar, User, ChevronRight } from 'lucide-react';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const res = await getCategoryBySlug(params.slug);
    const cat = res.data;
    if (!cat) return {};

    return {
      title: `${cat.name} — Editorial Category`,
      description: cat.description || `Articles and essays on ${cat.name} from Jalsa Salana Nigeria.`,
    };
  } catch {
    return {};
  }
}

export default async function CategoryDetailPage({ params }: { params: { slug: string } }) {
  let category: any;
  let articles: any[] = [];
  try {
    const [catRes, artRes] = await Promise.all([
      getCategoryBySlug(params.slug),
      getArticles({ category: params.slug, limit: 12 }),
    ]);
    category = catRes.data;
    articles = artRes.data || [];
  } catch {
    notFound();
  }

  if (!category) notFound();

  return (
    <div className="py-8 sm:py-12 bg-surface-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6 font-medium">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 text-gray-300" />
          <Link href="/articles" className="hover:text-primary transition-colors">Articles</Link>
          <ChevronRight className="w-3 h-3 text-gray-300" />
          <span className="text-primary font-bold">{category.name}</span>
        </nav>

        {/* Category Header */}
        <div className="p-8 rounded-2xl bg-white border border-gray-200 shadow-sm mb-10">
          <div className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white mb-2" style={{ backgroundColor: category.color || '#064e3b' }}>
            Category
          </div>
          <h1 className="font-serif font-black text-3xl sm:text-4xl text-charcoal mb-3">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-sm text-gray-600 max-w-2xl leading-relaxed">
              {category.description}
            </p>
          )}
        </div>

        {/* Articles Grid */}
        {articles.length === 0 ? (
          <div className="py-12 text-center bg-white rounded-xl border border-gray-200">
            <p className="text-gray-500 text-sm">No articles currently published under this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article: any) => (
              <article
                key={article.id}
                className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm flex flex-col justify-between group hover:shadow-md transition-all"
              >
                <div>
                  <Link href={`/articles/${article.slug}`} className="block relative aspect-[16/10] bg-gray-100 overflow-hidden">
                    <Image
                      src={article.featuredImage || '/images/jalsa-convention-a.jpg'}
                      alt={article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  <div className="p-5">
                    <Link href={`/articles/${article.slug}`}>
                      <h2 className="font-serif font-bold text-lg text-charcoal group-hover:text-primary transition-colors leading-snug mb-2 line-clamp-2">
                        {article.title}
                      </h2>
                    </Link>

                    {article.subtitle && (
                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-4">
                        {article.subtitle}
                      </p>
                    )}
                  </div>
                </div>

                <div className="px-5 pb-5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                  <span className="font-medium text-gray-700 truncate max-w-[150px]">
                    {article.author?.name}
                  </span>
                  <span className="flex items-center gap-1 flex-shrink-0">
                    <Clock className="w-3.5 h-3.5 text-gold-dark" />
                    {article.readingTime || 5} min read
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
