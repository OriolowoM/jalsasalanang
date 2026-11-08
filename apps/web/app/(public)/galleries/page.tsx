import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getGalleries } from '@/lib/api';
import { Camera, Calendar, ArrowRight, User } from 'lucide-react';

export const metadata = {
  title: 'Photography & Video Archives',
  description: 'Visual chronicles and photo albums capturing seven decades of Jalsa Salana Nigeria spiritual assemblies.',
};

export default async function GalleriesListingPage() {
  const res = await getGalleries().catch(() => ({ data: [] }));
  const galleries = res.data || [];

  return (
    <div className="py-8 sm:py-12 bg-surface-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="pb-6 mb-10 border-b-2 border-primary">
          <span className="text-xs font-extrabold uppercase tracking-widest text-gold-dark block mb-1">
            Visual Media
          </span>
          <h1 className="font-serif font-black text-3xl sm:text-4xl lg:text-5xl text-charcoal-heading">
            Photography &amp; Video Highlights
          </h1>
          <p className="text-sm text-gray-600 mt-2 max-w-3xl leading-relaxed">
            High-resolution photographic essays and documentary records chronicling convention marquees, prayer assemblies, volunteer logistics, and state receptions.
          </p>
        </div>

        {/* Galleries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {galleries.map((gallery: any) => (
            <div
              key={gallery.id}
              className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm flex flex-col justify-between group hover:shadow-md transition-all"
            >
              <div>
                <div className="relative aspect-[16/10] bg-gray-100 overflow-hidden">
                  <Image
                    src={gallery.coverImage || gallery.photos?.[0]?.url || '/images/70th-jalsa-hero.jpg'}
                    alt={gallery.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-black/60 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm flex items-center gap-1">
                      <Camera className="w-3 h-3 text-gold" />
                      {gallery.photosCount || gallery.photos?.length || 6} Photos
                    </span>
                    {gallery.edition && (
                      <span className="px-2 py-0.5 rounded-full bg-gold/90 text-primary-dark text-[10px] font-extrabold uppercase">
                        {gallery.edition.year}
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5">
                  <h2 className="font-serif font-bold text-lg text-charcoal leading-snug mb-2">
                    {gallery.title}
                  </h2>
                  {gallery.description && (
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-4">
                      {gallery.description}
                    </p>
                  )}
                  {gallery.photographer && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <User className="w-3.5 h-3.5 text-primary" />
                      <span>{gallery.photographer}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Photos Preview Thumbnails */}
              {gallery.photos?.length > 0 && (
                <div className="px-5 pb-5 pt-2 border-t border-gray-100">
                  <div className="grid grid-cols-4 gap-2">
                    {gallery.photos.slice(0, 4).map((p: any, idx: number) => (
                      <div key={p.id || idx} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                        <Image src={p.url} alt="" fill className="object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
