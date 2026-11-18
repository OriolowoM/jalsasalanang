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
    { title: 'Keynote Address & Main Dais', url: '/images/jalsa_gallery/jalsa-main-stage-keynote-podium.jpg', caption: 'Keynote presentation delivered from the floral podium of the 70th Platinum Jubilee.', credit: 'Official Jalsa Media' },
    { title: 'Night Tahajjud in Grand Marquee', url: '/images/jalsa_gallery/jalsa-night-marquee-tahajjud.jpg', caption: 'Tahajjud and Fajr prayers illuminated under the grand convention marquee.', credit: 'Official Jalsa Media' },
    { title: 'State Dignitary Reception', url: '/images/jalsa_gallery/jalsa-governor-abiodun-amir-handshake.jpg', caption: 'His Excellency Prince Dapo Abiodun, Governor of Ogun State, received by National Amir.', credit: 'Official Jalsa Media' },
    { title: 'Discipline & Volunteer Corps', url: '/images/jalsa_gallery/jalsa-khuddam-security-discipline.jpg', caption: 'Majlis Khuddamul Ahmadiyya discipline and security corps in uniform.', credit: 'Official Jalsa Media' },
    { title: 'Ride to Jalsa — Cycling Caravan', url: '/images/jalsa_gallery/jalsa-cycling-association-arrival.jpg', caption: 'Ahmadiyya Cycling Association riders arriving in team kits on convention grounds.', credit: 'Official Jalsa Media' },
    { title: 'Royal Obas & Traditional Custodians', url: '/images/jalsa_gallery/jalsa-traditional-rulers-obas.jpg', caption: 'Traditional Royal Obas in beaded crowns seated in the VIP gallery.', credit: 'Official Jalsa Media' },
  ];

  const photos = galleries[0]?.photos?.length > 0 ? galleries[0].photos : defaultPhotos;

  return (
    <section className="py-20 sm:py-28 bg-surface-muted border-b border-surface-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 mb-10 border-b border-teal/20 gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <Camera className="w-5 h-5 text-teal" />
              <h2 className="font-display font-extrabold text-display-md text-forest tracking-tight">
                Photography &amp; Visual Archives
              </h2>
            </div>
            <p className="text-sm text-ink-muted font-sans">
              Documenting the spiritual ambiance, volunteer spirit, and historic moments across Jalsa Salana Nigeria conventions.
            </p>
          </div>
          <Link
            href="/galleries"
            className="text-xs font-display font-bold uppercase tracking-[0.2em] text-teal hover:text-forest flex items-center gap-1.5 flex-shrink-0 transition-colors"
          >
            <span>All Photo Albums</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {photos.slice(0, 6).map((photo: any, index: number) => (
            <div
              key={photo.id || index}
              onClick={() => setSelectedPhoto(photo)}
              className="relative aspect-square rounded-3xl overflow-hidden bg-surface-card cursor-pointer group shadow-soft hover:shadow-soft-lg ring-1 ring-black/5 hover:scale-[1.03] transition-all duration-300"
            >
              <Image
                src={photo.url}
                alt={photo.title || 'Jalsa photo'}
                fill
                className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-forest-950/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white backdrop-blur-[2px]">
                <Maximize2 className="w-5 h-5 text-lime drop-shadow" />
              </div>
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-forest-950/90 via-forest-950/40 to-transparent p-3 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="text-[11px] font-display font-bold line-clamp-1">{photo.title}</div>
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
            <div className="relative w-full h-[65vh] rounded-2xl overflow-hidden">
              <Image
                src={selectedPhoto.url}
                alt={selectedPhoto.title || ''}
                fill
                className="object-contain"
                priority
              />
            </div>

            <div className="mt-4 text-center text-white max-w-2xl px-4">
              <h3 className="font-display font-bold text-lg">{selectedPhoto.title}</h3>
              {selectedPhoto.caption && (
                <p className="text-xs text-white/70 mt-1 font-sans">{selectedPhoto.caption}</p>
              )}
              {selectedPhoto.credit && (
                <div className="text-[11px] text-lime mt-1 font-medium">{selectedPhoto.credit}</div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
