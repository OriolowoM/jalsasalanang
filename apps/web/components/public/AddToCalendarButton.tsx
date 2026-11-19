'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronDown, Download, ExternalLink } from 'lucide-react';

interface Props {
  className?: string;
}

export default function AddToCalendarButton({ className = '' }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    '72nd Jalsa Salana Nigeria 2026'
  )}&dates=20261218/20261221&details=${encodeURIComponent(
    'Theme: Observing Justice and Human Rights: The foundation for true Global Peace.\nVenue: Jamia Ahmadiyya Ilaro, Ogun State, Nigeria.\nOfficial Website: https://jalsasalana.ng/programme-of-events-jalsa-salana-nigeria-2026'
  )}&location=${encodeURIComponent('Jamia Ahmadiyya Ilaro, Ogun State, Nigeria')}`;

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gold hover:bg-gold-hover text-primary-950 font-bold text-xs uppercase tracking-wider transition-all shadow-md"
      >
        <Calendar className="w-4 h-4" />
        <span>Add to Calendar</span>
        <ChevronDown className="w-3.5 h-3.5 opacity-70" />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-56 rounded-xl bg-white shadow-xl border border-gray-200 py-1.5 z-50 animate-fadeIn text-charcoal">
          <a
            href={googleCalendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-between px-4 py-2.5 text-xs hover:bg-gray-50 transition-colors font-semibold"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span>Google Calendar</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
          </a>

          <a
            href="/api/v1/external/calendar/jalsa-2026.ics"
            download="jalsa-salana-nigeria-2026.ics"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-between px-4 py-2.5 text-xs hover:bg-gray-50 transition-colors font-semibold border-t border-gray-100"
          >
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-600"></span>
              <span>Apple / Outlook (.ics)</span>
            </div>
            <Download className="w-3.5 h-3.5 text-gray-400" />
          </a>
        </div>
      )}
    </div>
  );
}
