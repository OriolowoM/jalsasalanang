'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Camera, X, ArrowRight, Maximize2 } from 'lucide-react';

interface Props {
  galleries: any[];
}

export default function MediaHighlightsSection({ galleries = [] }: Props) {
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);

  const defaultPhotos = [
    { title: 'Grand Assembly Marquee', url: '/images/70th-jalsa-hero.jpg', caption: 'The main marquee packed with thousands of delegates in Ilaro.', credit: 'Jalsa Photojournalism Unit' },
    { title: 'Dignitary Arrivals', url: '/images/guest-aregbesola.jpg', caption: 'Official reception of state dignitaries and foreign guests.', credit: 'Photo: Jalsa Media' },
    { title: 'Congregational Supplication', url: '/images/jalsa-prayer.jpg', caption: 'Deep spiritual contemplation during Tahajjud prayer sessions.', credit: 'Photo: Jalsa Media' },
    { title: 'Scholars Symposium', url: '/images/jalsa-scholars.jpg', caption: 'Missionaries and keynote presenters delivering lectures.', credit: 'Photo: Central Tarbiyya' },
    { title: 'International Delegations', url: '/images/jalsa-international.jpg', caption: 'Delegates from neighboring West African nations.', credit: 'Photo: Jalsa Media' },
    { title: 'Women\'s Convention Session', url: '/images/jalsa-audience.jpg', caption: 'Dedicated session of Lajna Imaillah delegates.', credit: 'Photo: Lajna Media' },
  ];

  const photos = galleries[0]?.photos?.length > 0 ? galleries[0].photos : defaultPhotos;

  return (
    <section className="py-12 bg-surface-muted border-b border-surface-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 mb-8 border-b-2 border-primary gap-2">
          <div>
            <div className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-primary" />
              <h2 className="font-serif font-black text-2xl sm:text-3xl text-charcoal-heading">
                Photography &amp; Visual Archives
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Documenting the spiritual ambiance, volunteer spirit, and historic moments across Jalsa Salana Nigeria conventions.
            </p>
          </div>
          <Link
            href="/galleries"
            className="text-xs font-bold uppercase tracking-wider text-gold-dark hover:text-primary flex items-center gap-1 flex-shrink-0"
          >
            All Photo Albums <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {photos.slice(0, 6).map((photo: any, index: number) => (
            <div
              key={photo.id || index}
              onClick={() => setSelectedPhoto(photo)}
              className="relative aspect-square rounded-xl overflow-hidden bg-gray-200 cursor-pointer group shadow-sm hover:shadow-md transition-all"
            >
              <Image
                src={photo.url}
                alt={photo.title || 'Jalsa photo'}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <Maximize2 className="w-5 h-5 drop-shadow" />
              </div>
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-2 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="text-[10px] font-bold line-clamp-1">{photo.title}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Accessible Fullscreen Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-8 animate-in fade-in duration-150"
          onClick={() => setSelectedPhoto(null)}
        >
          <button
            type="button"
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div
            className="relative max-w-4xl max-h-[80vh] w-full h-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-[65vh] rounded-lg overflow-hidden">
              <Image
                src={selectedPhoto.url}
                alt={selectedPhoto.title || ''}
                fill
                className="object-contain"
                priority
              />
            </div>

            <div className="mt-4 text-center text-white max-w-2xl px-4">
              <h3 className="font-serif font-bold text-lg">{selectedPhoto.title}</h3>
              {selectedPhoto.caption && (
                <p className="text-xs text-gray-300 mt-1">{selectedPhoto.caption}</p>
              )}
              {selectedPhoto.credit && (
                <div className="text-[11px] text-gold mt-1 font-medium">{selectedPhoto.credit}</div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
