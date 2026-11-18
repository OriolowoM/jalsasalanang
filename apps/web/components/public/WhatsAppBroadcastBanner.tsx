'use client';

import React from 'react';
import { MessageSquare, Bell, ArrowRight, Users } from 'lucide-react';

export default function WhatsAppBroadcastBanner() {
  const channelUrl = 'https://whatsapp.com/channel/0029VaOfficialJalsaNigeria';
  const helplineUrl = 'https://wa.me/2348030000000?text=Salam%2C+I+have+an+enquiry+regarding+the+72nd+Jalsa+Salana+Nigeria+2026';

  return (
    <section className="py-12 bg-forest text-white relative overflow-hidden border-y border-teal/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left Text */}
          <div className="space-y-2 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-teal/20 text-lime border border-teal/30 text-xs font-display font-bold uppercase tracking-wider">
              <Bell className="w-3.5 h-3.5 text-lime" />
              <span>Official Delegate Broadcast Channel</span>
            </div>
            <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
              Stay Connected on WhatsApp
            </h3>
            <p className="text-sm text-white/70 max-w-xl font-sans leading-relaxed">
              Receive instant announcements, live MTA streaming alerts, daily session timetables, and transportation circulars for Jalsa Salana Nigeria.
            </p>
          </div>

          {/* Right Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3.5">
            <a
              href={channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-teal hover:bg-teal-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-glow-teal hover:scale-105"
            >
              <Users className="w-4 h-4 text-lime" />
              <span>Join WhatsApp Channel</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <a
              href={helplineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs uppercase tracking-wider transition-all border border-white/15"
            >
              <MessageSquare className="w-4 h-4 text-lime" />
              <span>Secretariat Helpline</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
