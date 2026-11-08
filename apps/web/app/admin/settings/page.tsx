'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Save, CheckCircle, AlertCircle } from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({
    site_title: 'Jalsa Salana Nigeria',
    site_tagline: 'Digital Editorial & Publishing Platform',
    ticker_text: 'REGISTRATION NOW OPEN: 72nd Jalsa Salana Nigeria — December 18–20, 2026 at Jamia Ilaro, Ogun State',
    ticker_link: '/editions/2026',
    contact_email: 'info@jalsasalana.ng',
    contact_phone: '+234 803 000 0000',
    contact_address: 'Ahmadiyya Muslim Jama\'at Nigeria Headquarters, Ojokoro, Lagos State',
    social_x: 'https://x.com/Ahmadiyya_NG',
    social_facebook: 'https://facebook.com/ahmadiyyang',
    social_youtube: 'https://youtube.com/mta_international',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetch('/api/v1/settings', { credentials: 'include' })
      .then((r) => r.json())
      .then((res) => {
        if (res.success && res.data) {
          setSettings((prev) => ({ ...prev, ...res.data }));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess('');

    try {
      const res = await fetch('/api/v1/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings }),
        credentials: 'include',
      });

      if (res.ok) {
        setSuccess('Platform settings and announcement ticker saved successfully.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="pb-4 border-b border-gray-200">
        <h1 className="font-serif font-black text-2xl sm:text-3xl text-charcoal">
          Platform Configuration &amp; Settings
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Manage homepage announcement ticker, organizational contact details, and social channels.
        </p>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs font-semibold flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Announcement Ticker */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <h2 className="font-serif font-bold text-base text-charcoal pb-2 border-b border-gray-100 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" /> Global Announcement Ticker
          </h2>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
              Top Banner Ticker Text
            </label>
            <input
              type="text"
              value={settings.ticker_text || ''}
              onChange={(e) => setSettings({ ...settings, ticker_text: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs outline-none focus:border-primary text-charcoal"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
              Ticker Target URL
            </label>
            <input
              type="text"
              value={settings.ticker_link || ''}
              onChange={(e) => setSettings({ ...settings, ticker_link: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs outline-none focus:border-primary text-charcoal"
            />
          </div>
        </div>

        {/* General Site Information */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <h2 className="font-serif font-bold text-base text-charcoal pb-2 border-b border-gray-100">
            Publication Identity
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                Publication Title
              </label>
              <input
                type="text"
                value={settings.site_title || ''}
                onChange={(e) => setSettings({ ...settings, site_title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs outline-none focus:border-primary text-charcoal"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                Tagline / Descriptor
              </label>
              <input
                type="text"
                value={settings.site_tagline || ''}
                onChange={(e) => setSettings({ ...settings, site_tagline: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs outline-none focus:border-primary text-charcoal"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <h2 className="font-serif font-bold text-base text-charcoal pb-2 border-b border-gray-100">
            Contact &amp; Accreditation Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                Contact Email
              </label>
              <input
                type="email"
                value={settings.contact_email || ''}
                onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs outline-none focus:border-primary text-charcoal"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                Inquiries Phone
              </label>
              <input
                type="text"
                value={settings.contact_phone || ''}
                onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs outline-none focus:border-primary text-charcoal"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                Headquarters Address
              </label>
              <input
                type="text"
                value={settings.contact_address || ''}
                onChange={(e) => setSettings({ ...settings, contact_address: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs outline-none focus:border-primary text-charcoal"
              />
            </div>
          </div>
        </div>

        {/* Social Media Channels */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
          <h2 className="font-serif font-bold text-base text-charcoal pb-2 border-b border-gray-100">
            Official Broadcast &amp; Social Channels
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                X / Twitter
              </label>
              <input
                type="url"
                value={settings.social_x || ''}
                onChange={(e) => setSettings({ ...settings, social_x: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs outline-none focus:border-primary text-charcoal"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                Facebook
              </label>
              <input
                type="url"
                value={settings.social_facebook || ''}
                onChange={(e) => setSettings({ ...settings, social_facebook: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs outline-none focus:border-primary text-charcoal"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                YouTube / MTA
              </label>
              <input
                type="url"
                value={settings.social_youtube || ''}
                onChange={(e) => setSettings({ ...settings, social_youtube: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-xs outline-none focus:border-primary text-charcoal"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 rounded-lg bg-primary hover:bg-primary-dark text-white font-bold text-xs uppercase tracking-wider transition-colors shadow flex items-center gap-2"
        >
          <Save className="w-4 h-4 text-gold" />
          <span>{saving ? 'Saving...' : 'Save All Settings'}</span>
        </button>
      </form>
    </div>
  );
}
