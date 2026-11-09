'use client';

import React from 'react';
import Link from 'next/link';
import { Radio, Calendar, ChevronRight } from 'lucide-react';

interface Props {
  text?: string;
  link?: string;
}

export default function AnnouncementTicker({
  text = 'OFFICIAL REGISTRATION PORTAL: 72nd Jalsa Salana Nigeria 2026 is Live — Register Your Household & Delegations',
  link = '/registration',
}: Props) {
  const currentDate = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="bg-primary-dark text-white text-xs border-b border-primary-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-col sm:flex-row items-center justify-between gap-2">
        {/* Left: Live status and ticker */}
        <div className="flex items-center gap-3 overflow-hidden w-full sm:w-auto">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-600 text-[10px] font-bold uppercase tracking-wider animate-pulse flex-shrink-0 text-white shadow-sm">
            <Radio className="w-3 h-3 text-gold" />
            Registration Open
          </span>
          <Link
            href={link}
            className="hover:text-gold transition-colors truncate flex items-center gap-1 font-medium"
          >
            <span>{text}</span>
            <ChevronRight className="w-3 h-3 flex-shrink-0 text-gold" />
          </Link>
        </div>

        {/* Right: Date & Portal Links */}
        <div className="hidden md:flex items-center gap-4 text-gray-300 flex-shrink-0">
          <Link 
            href="/registration" 
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-gold hover:text-white bg-gold/10 hover:bg-gold/20 px-2 py-0.5 rounded border border-gold/30 transition-colors"
          >
            <span>Registration Guide</span>
            <ChevronRight className="w-3 h-3" />
          </Link>
          <span className="text-gray-600">|</span>
          <span className="flex items-center gap-1 text-[11px]">
            <Calendar className="w-3 h-3 text-gold" />
            {currentDate}
          </span>
          <span className="text-gray-600">|</span>
          <Link href="/login" className="hover:text-white transition-colors text-[11px] font-medium text-gray-400">
            Staff Portal
          </Link>
        </div>
      </div>
    </div>
  );
}
