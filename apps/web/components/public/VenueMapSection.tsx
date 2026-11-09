'use client';

import React from 'react';
import { MapPin, Navigation, Compass, Phone, MessageSquare, Car, ExternalLink, ShieldCheck } from 'lucide-react';

export default function VenueMapSection() {
  const directionsUrl = 'https://www.google.com/maps/dir/?api=1&destination=6.8872,3.0142';
  const whatsappUrl = 'https://wa.me/2348030000000?text=Salam%2C+I+need+travel+directions+and+delegates+information+for+Jalsa+Salana+Nigeria+Ilaro';

  return (
    <section className="py-12 bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="pb-4 mb-8 border-b border-gray-200 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-widest text-gold-dark block mb-1">
              Convention Location &amp; Logistics
            </span>
            <h2 className="font-serif font-black text-2xl sm:text-3xl text-charcoal-heading">
              Jamia Ahmadiyya Ilaro, Ogun State
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-2xl">
              Permanent national convention grounds for Jalsa Salana Nigeria featuring dedicated marquees, guest accommodation, and MTA broadcast suites.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>Get GPS Directions</span>
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp Helpline</span>
            </a>
          </div>
        </div>

        {/* Grid: Map Embed + Route Directions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Interactive Map Embed (7 cols) */}
          <div className="lg:col-span-7 bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 shadow-sm relative aspect-[16/10]">
            <iframe
              src="https://maps.google.com/maps?q=6.8872,3.0142&z=14&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Jamia Ahmadiyya Ilaro Location Map"
              className="w-full h-full"
            />
            {/* Overlay Pin Badge */}
            <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm p-3 rounded-xl border border-gray-200 shadow-md flex items-center gap-3 text-xs">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                <MapPin className="w-4 h-4 text-gold" />
              </div>
              <div>
                <span className="font-bold text-charcoal block">Jamia Ahmadiyya Ilaro</span>
                <span className="text-[10px] text-gray-500 font-mono">6.8872° N, 3.0142° E</span>
              </div>
            </div>
          </div>

          {/* Travel Advisories & Corridor Guidelines (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="font-serif font-bold text-base text-charcoal mb-3 flex items-center gap-2">
              <Compass className="w-4 h-4 text-gold-dark" />
              <span>Travel Advisories for Delegates</span>
            </h3>

            <div className="p-4 rounded-xl bg-surface-bg border border-gray-200 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-primary">
                <Car className="w-4 h-4 text-primary" />
                <span>From Lagos &amp; MMIA Airport (Approx. 2.5 hrs)</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Take the Lagos-Abeokuta Expressway to Papalanto junction, turning onto the Ilaro corridor. Official Jalsa transportation shuttles will be stationed at Ojokoro Headquarters.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-surface-bg border border-gray-200 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-primary">
                <Car className="w-4 h-4 text-primary" />
                <span>From Ibadan &amp; Northern Corridors (Approx. 2 hrs)</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Travel through Abeokuta via the Rounda-Ibese-Ilaro route. Road signage and Jalsa traffic marshals will be deployed across major junctions.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-surface-bg border border-gray-200 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-primary">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>International &amp; West African Delegates</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Delegates arriving from Benin Republic, Togo, and Ghana can access Ilaro via the Owode border crossing (45 mins). Dedicated reception desks operate 24/7.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
