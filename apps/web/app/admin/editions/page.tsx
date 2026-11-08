'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Plus, Trash2, Edit, Check, Star, ExternalLink } from 'lucide-react';

export default function AdminEditionsPage() {
  const [editions, setEditions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Form State
  const [year, setYear] = useState('2027');
  const [editionNumber, setEditionNumber] = useState('73rd Annual Convention');
  const [themeEnglish, setThemeEnglish] = useState('');
  const [themeArabic, setThemeArabic] = useState('');
  const [venue, setVenue] = useState('Jamia Ahmadiyya Ilaro, Ogun State, Nigeria');
  const [dates, setDates] = useState('December 2027');
  const [attendance, setAttendance] = useState('45,000+ Delegates');
  const [isCurrent, setIsCurrent] = useState(false);

  const loadEditions = () => {
    setLoading(true);
    fetch('/api/v1/editions', { credentials: 'include' })
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setEditions(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadEditions();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        year: parseInt(year, 10),
        editionNumber,
        themeEnglish,
        themeArabic: themeArabic || undefined,
        venue,
        dates,
        attendance,
        isCurrent,
      };

      const res = await fetch('/api/v1/editions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'include',
      });

      if (res.ok) {
        setShowForm(false);
        loadEditions();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this historical edition record?')) {
      try {
        await fetch(`/api/v1/editions/${id}`, { method: 'DELETE', credentials: 'include' });
        loadEditions();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="font-serif font-black text-2xl sm:text-3xl text-charcoal">
            Jalsa Editions Registry
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Historical conventions, upcoming milestone editions, themes, and archival hubs.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors shadow"
        >
          <Plus className="w-4 h-4 text-gold" />
          <span>{showForm ? 'Cancel' : 'Add Future / Past Edition'}</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm animate-in fade-in duration-200">
          <h2 className="font-serif font-bold text-base text-charcoal mb-4">
            Register Convention Milestone
          </h2>

          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                Convention Year *
              </label>
              <input
                type="number"
                required
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs outline-none focus:border-primary text-charcoal"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                Edition Number *
              </label>
              <input
                type="text"
                required
                value={editionNumber}
                onChange={(e) => setEditionNumber(e.target.value)}
                placeholder="e.g. 73rd Annual Convention"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs outline-none focus:border-primary text-charcoal"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                Official Convention Theme (English) *
              </label>
              <input
                type="text"
                required
                value={themeEnglish}
                onChange={(e) => setThemeEnglish(e.target.value)}
                placeholder="Theme title..."
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs outline-none focus:border-primary text-charcoal"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                Theme in Arabic Calligraphy / Quranic Ayah
              </label>
              <input
                type="text"
                value={themeArabic}
                onChange={(e) => setThemeArabic(e.target.value)}
                dir="rtl"
                placeholder="Arabic Quranic quotation..."
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-base font-arabic outline-none focus:border-primary text-charcoal"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                Venue &amp; Location
              </label>
              <input
                type="text"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs outline-none focus:border-primary text-charcoal"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                Dates
              </label>
              <input
                type="text"
                value={dates}
                onChange={(e) => setDates(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs outline-none focus:border-primary text-charcoal"
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-xs font-bold text-primary cursor-pointer">
                <input
                  type="checkbox"
                  checked={isCurrent}
                  onChange={(e) => setIsCurrent(e.target.checked)}
                  className="rounded text-primary focus:ring-primary"
                />
                <span>Set as Active Milestone (powers homepage ticker &amp; live countdown)</span>
              </label>
            </div>

            <div className="md:col-span-2 pt-2">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-white font-bold text-xs uppercase tracking-wider transition-colors shadow"
              >
                Save Convention
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Editions List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {editions.map((ed) => (
          <div
            key={ed.id}
            className={`p-6 rounded-xl border flex flex-col justify-between transition-all shadow-sm ${
              ed.isCurrent
                ? 'bg-primary-subtle border-primary'
                : 'bg-white border-gray-200'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-serif font-black text-3xl text-primary">{ed.year}</span>
                {ed.isCurrent ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-primary text-white text-[10px] font-extrabold uppercase flex items-center gap-1">
                    <Star className="w-3 h-3 text-gold fill-gold" /> Active Hub
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-[10px] font-bold">
                    Archived
                  </span>
                )}
              </div>

              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                {ed.editionNumber}
              </div>

              <h3 className="font-serif font-bold text-base text-charcoal mb-2 leading-snug">
                {ed.themeEnglish}
              </h3>

              {ed.themeArabic && (
                <div className="font-arabic text-sm text-gold-dark mb-3 line-clamp-1" dir="rtl">
                  {ed.themeArabic}
                </div>
              )}

              <div className="text-xs text-gray-500 space-y-1 mb-4">
                <div>📅 {ed.dates}</div>
                <div>📍 {ed.venue}</div>
                {ed.attendance && <div>👥 {ed.attendance}</div>}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200/60 flex items-center justify-between text-xs">
              <div className="text-[11px] text-gray-400">
                {ed.speechesCount || 0} speeches • {ed.articlesCount || 0} articles
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href={`/editions/${ed.year}`}
                  target="_blank"
                  className="p-1 text-gray-400 hover:text-primary rounded hover:bg-gray-100"
                  title="View on site"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(ed.id)}
                  className="p-1 text-gray-400 hover:text-red-600 rounded hover:bg-gray-100"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
