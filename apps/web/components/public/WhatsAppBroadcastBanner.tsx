'use client';

import React from 'react';
import { MessageSquare, Bell, ArrowRight, ShieldCheck, Users } from 'lucide-react';

export default function WhatsAppBroadcastBanner() {
  const channelUrl = 'https://whatsapp.com/channel/0029VaOfficialJalsaNigeria';
  const helplineUrl = 'https://wa.me/2348030000000?text=Salam%2C+I+have+an+enquiry+regarding+the+72nd+Jalsa+Salana+Nigeria+2026';

  return (
    <section className="py-8 bg-emerald-900 text-white relative overflow-hidden border-y border-emerald-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Left Text */}
          <div className="space-y-2 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800/80 text-emerald-200 border border-emerald-700 text-xs font-bold uppercase tracking-wider">
              <Bell className="w-3.5 h-3.5 text-gold" />
              <span>Official Delegate Broadcast Channel</span>
            </div>
            <h3 className="font-serif font-black text-xl sm:text-2xl text-white">
              Stay Connected on WhatsApp
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
              Receive instant announcements, live MTA streaming alerts, daily session timetables, and transportation circulars for Jalsa Salana Nigeria.
            </p>
          </div>

          {/* Right Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-gray-100 text-emerald-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg hover:scale-105"
            >
              <Users className="w-4 h-4 text-emerald-700" />
              <span>Join WhatsApp Channel</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href={helplineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-950/60 hover:bg-emerald-950 text-white font-semibold text-xs uppercase tracking-wider transition-all border border-emerald-700"
            >
              <MessageSquare className="w-4 h-4 text-gold" />
              <span>Secretariat Helpline</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
