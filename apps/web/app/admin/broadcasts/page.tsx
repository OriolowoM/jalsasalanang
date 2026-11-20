'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Share2,
  Copy,
  Check,
  Send,
  Sparkles,
  MessageSquare,
  Compass,
  FileText,
  Music,
  MapPin,
  Calendar,
  AlertCircle,
  ExternalLink,
  Smartphone,
  Eye,
  RefreshCw,
} from 'lucide-react';
import { PROGRAMME_DAYS, JALSA_2026_META } from '@/lib/programme-2026';
import { JALSA_JINGLES_2026 } from '@/lib/jingles-2026';

type ContentSourceType = 'programme' | 'audio' | 'grounds' | 'custom';
type TargetAudience = 'general' | 'youth' | 'lajna' | 'circuits' | 'press';

interface BroadcastTemplate {
  id: string;
  category: ContentSourceType;
  title: string;
  hook: string;
  takeaway: string;
  urlPath: string;
}

const PRESET_TEMPLATES: BroadcastTemplate[] = [
  {
    id: 'huzur-sermon',
    category: 'programme',
    title: 'Live Friday Sermon of Hazrat Khalifatul Masih V (aba)',
    hook: '🔴 *LIVE BROADCAST:* Live Friday Sermon of Hazrat Khalifatul Masih V (aba)',
    takeaway: 'Delegates across Jamia Ahmadiyya Ilaro assemble for the worldwide live Friday Sermon via MTA International.',
    urlPath: '/programme-of-events-jalsa-salana-nigeria-2026#f07',
  },
  {
    id: 'lecture-one',
    category: 'programme',
    title: 'Inaugural Address & Lecture One (Amir Sahib)',
    hook: '✨ *JALSA NIGERIA 2026 OPENING:* Inaugural Address by Amir Sahib',
    takeaway: '“Observing Justice and Human Rights: The Foundation for True Global Peace.” Simultaneous translations in Yoruba and Hausa.',
    urlPath: '/programme-of-events-jalsa-salana-nigeria-2026#f11',
  },
  {
    id: 'grounds-map',
    category: 'grounds',
    title: 'Interactive Grounds Map & GPS Navigation Hub',
    hook: '🗺️ *CONVENTION VENUE GUIDE:* Jamia Ahmadiyya Ilaro Ground Map',
    takeaway: 'Jalsa Male Gah is located to the LEFT, Female Gah (Lajna Pavilion) to the RIGHT. Tap for turn-by-turn GPS wayfinding and live crowd status.',
    urlPath: '/live-crowd',
  },
  {
    id: 'audio-jingles',
    category: 'audio',
    title: 'Sound of Jalsa 2026 Radio Jingles (4 Languages)',
    hook: '📻 *SOUND OF JALSA 2026:* Official Radio Broadcast Jingles',
    takeaway: 'Stream and download official convention jingles in English, Yoruba, Hausa, and Arabic for broadcasts and circuit convoys.',
    urlPath: '/#sound-of-jalsa',
  },
  {
    id: 'delegate-pass',
    category: 'grounds',
    title: 'Gate 2 Biometric Access & Personal Delegate Pass',
    hook: '🎫 *DELEGATE FAST-PASS:* Rapid Biometric Verification at Gate 2',
    takeaway: 'Have your digital access pass ready at Gate 2 West Hub for rapid scan. Personalize your 3-day itinerary on the dashboard.',
    urlPath: '/dashboard',
  },
  {
    id: 'concluding-address',
    category: 'programme',
    title: 'Closing Session & Silent Prayers by Amir Sahib',
    hook: '🤲 *CONCLUDING SESSION:* Final Address & Silent Prayers',
    takeaway: 'The spiritual climax of the 72nd Jalsa Salana Nigeria 2026. Join in person or tune into the live broadcast stream.',
    urlPath: '/programme-of-events-jalsa-salana-nigeria-2026#s06',
  },
];

export default function AdminWhatsAppBroadcastPage() {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(PRESET_TEMPLATES[0].id);
  const [sourceType, setSourceType] = useState<ContentSourceType>('programme');
  const [targetAudience, setTargetAudience] = useState<TargetAudience>('general');
  const [customHeadline, setCustomHeadline] = useState<string>('');
  const [customTakeaway, setCustomTakeaway] = useState<string>('');
  const [customUrl, setCustomUrl] = useState<string>('/programme-of-events-jalsa-salana-nigeria-2026');
  const [copied, setCopied] = useState<boolean>(false);
  const [copiedShort, setCopiedShort] = useState<boolean>(false);

  // Active Template
  const activeTemplate = useMemo(() => {
    return PRESET_TEMPLATES.find((t) => t.id === selectedTemplateId) || PRESET_TEMPLATES[0];
  }, [selectedTemplateId]);

  // Derived Audience Prefix
  const audiencePrefix = useMemo(() => {
    switch (targetAudience) {
      case 'youth':
        return '📢 *Attention MKAN / Khuddam & Atfal Delegates:*';
      case 'lajna':
        return '🌸 *Lajna Ima’illah & Nasirat Convention Notice:*';
      case 'circuits':
        return '📋 *For Circuit Presidents & Transport Marshals:*';
      case 'press':
        return '🎙️ *Press & Broadcast Media Bulletin:*';
      default:
        return '🌟 *72nd Jalsa Salana Nigeria 2026 (Ilaro):*';
    }
  }, [targetAudience]);

  // Compute 3-Line Broadcast Body
  const broadcastText = useMemo(() => {
    const isCustom = sourceType === 'custom';
    const headline = isCustom ? customHeadline || 'Special Jalsa Convention Update' : activeTemplate.hook;
    const takeaway = isCustom ? customTakeaway || 'Stay connected to official spiritual proceedings at Jamia Ahmadiyya Ilaro.' : activeTemplate.takeaway;
    const path = isCustom ? customUrl : activeTemplate.urlPath;
    const fullUrl = `https://jalsasalana.ng${path.startsWith('/') ? path : `/${path}`}?utm_source=whatsapp&utm_medium=broadcast&utm_campaign=jalsa2026`;

    return `${audiencePrefix}\n${headline}\n\n💬 ${takeaway}\n\n🔗 *Full details, audio & updates:* ${fullUrl}`;
  }, [sourceType, activeTemplate, audiencePrefix, customHeadline, customTakeaway, customUrl]);

  // One-line status snippet (ideal for WhatsApp status)
  const statusSnippet = useMemo(() => {
    const isCustom = sourceType === 'custom';
    const takeaway = isCustom ? customTakeaway : activeTemplate.takeaway;
    const path = isCustom ? customUrl : activeTemplate.urlPath;
    return `“${takeaway}”\n👉 https://jalsasalana.ng${path.startsWith('/') ? path : `/${path}`}`;
  }, [sourceType, activeTemplate, customTakeaway, customUrl]);

  const handleCopy = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText(broadcastText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleCopyStatus = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText(statusSnippet);
      setCopiedShort(true);
      setTimeout(() => setCopiedShort(false), 2500);
    }
  };

  const handleSendToWhatsApp = () => {
    if (typeof window !== 'undefined') {
      const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(broadcastText)}`;
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-teal-700 uppercase tracking-widest mb-1">
            <span>Editorial Media Desk</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#c5a049]" />
            <span className="text-[#003333]">WhatsApp Broadcast Generator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-[#003333]">
            Viral WhatsApp Broadcast Engine
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Create high-converting, 3-line punchy broadcasts with official jalsasalana.ng links to share across WhatsApp Channels, Jama’at groups, and Status feeds.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleSendToWhatsApp}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all active:scale-95"
          >
            <Send className="w-4 h-4 fill-current" />
            <span>Open in WhatsApp</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ── LEFT COLUMN: Controls & Presets (7 cols) ── */}
        <div className="lg:col-span-7 space-y-5">
          {/* Preset Selector Tabs */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#c5a049]" />
              <span>Select Content Template or Event</span>
            </h2>

            {/* Content Category Selector */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'programme', label: 'Programme', icon: Calendar },
                { id: 'grounds', label: 'Grounds & Map', icon: MapPin },
                { id: 'audio', label: 'Radio Audio', icon: Music },
                { id: 'custom', label: 'Custom Post', icon: FileText },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSourceType(cat.id as ContentSourceType)}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                    sourceType === cat.id
                      ? 'bg-[#003333] text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <cat.icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            {/* Presets List */}
            {sourceType !== 'custom' ? (
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Curated Convention Highlights:
                </label>
                <div className="grid grid-cols-1 gap-2 max-h-[260px] overflow-y-auto pr-1">
                  {PRESET_TEMPLATES.filter((t) => t.category === sourceType || sourceType === 'programme').map((tpl) => (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => setSelectedTemplateId(tpl.id)}
                      className={`text-left p-3 rounded-xl border text-xs transition-all ${
                        selectedTemplateId === tpl.id
                          ? 'border-[#003333] bg-[#003333]/5 ring-1 ring-[#003333]'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="font-bold text-[#003333]">{tpl.title}</div>
                      <div className="text-[11px] text-gray-500 truncate mt-0.5">{tpl.takeaway}</div>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Custom Message Editor */
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Custom Headline (Line 1):
                  </label>
                  <input
                    type="text"
                    value={customHeadline}
                    onChange={(e) => setCustomHeadline(e.target.value)}
                    placeholder="e.g. 📢 URGENT: Friday Jumu'ah Parking Advisory"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003333]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Key Takeaway / Message Body (Line 2):
                  </label>
                  <textarea
                    rows={3}
                    value={customTakeaway}
                    onChange={(e) => setCustomTakeaway(e.target.value)}
                    placeholder="Enter the 2-line essence of the message..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003333]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Target URL Path (Line 3):
                  </label>
                  <input
                    type="text"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    placeholder="/live-crowd or /programme-of-events-jalsa-salana-nigeria-2026"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#003333]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Target Audience Filter */}
          <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-3">
            <h2 className="text-sm font-bold text-gray-800">Target Demographic / Auxiliary</h2>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'general', label: 'All Delegates' },
                { id: 'youth', label: 'Khuddam & Atfal' },
                { id: 'lajna', label: 'Lajna (Ladies)' },
                { id: 'circuits', label: 'Circuit Presidents' },
                { id: 'press', label: 'Media & Radio' },
              ].map((aud) => (
                <button
                  key={aud.id}
                  type="button"
                  onClick={() => setTargetAudience(aud.id as TargetAudience)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    targetAudience === aud.id
                      ? 'bg-[#c5a049] text-[#002626] shadow-xs'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {aud.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN: Live WhatsApp Chat Simulation Preview (5 cols) ── */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-[#efeae2] rounded-3xl p-4 border border-gray-300 shadow-lg relative overflow-hidden">
            {/* WhatsApp App Mock Header */}
            <div className="bg-[#075e54] text-white p-3 rounded-2xl flex items-center justify-between mb-4 shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs text-white">
                  JS
                </div>
                <div>
                  <div className="text-xs font-bold leading-tight">Jalsa Salana Nigeria 2026</div>
                  <div className="text-[10px] text-emerald-200">Official Broadcast Channel</div>
                </div>
              </div>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-bold">
                Channel
              </span>
            </div>

            {/* WhatsApp Chat Bubble */}
            <div className="bg-[#d9fdd3] text-[#111b21] p-4 rounded-2xl shadow-sm text-xs space-y-2 border border-emerald-200/60 leading-relaxed relative">
              <p className="font-semibold text-emerald-950 whitespace-pre-wrap">
                {audiencePrefix}
              </p>

              <p className="font-bold text-gray-900">
                {sourceType === 'custom' ? customHeadline || 'Special Update' : activeTemplate.hook}
              </p>

              <p className="text-gray-800">
                💬 {sourceType === 'custom' ? customTakeaway || 'Convention update details...' : activeTemplate.takeaway}
              </p>

              {/* Rich Link Card Mock */}
              <div className="mt-2 p-2.5 bg-white/80 rounded-xl border border-emerald-300/60 shadow-xs">
                <div className="text-[11px] font-bold text-[#003333] flex items-center gap-1">
                  <span>jalsasalana.ng</span>
                  <ExternalLink className="w-3 h-3 text-teal-600" />
                </div>
                <div className="text-[10px] text-gray-600 line-clamp-1">
                  72nd Jalsa Salana Nigeria 2026 · Jamia Ahmadiyya Ilaro
                </div>
                <div className="text-[10px] text-emerald-700 font-mono mt-0.5 truncate">
                  https://jalsasalana.ng{sourceType === 'custom' ? customUrl : activeTemplate.urlPath}
                </div>
              </div>

              {/* Timestamp & Read Receipt */}
              <div className="text-right text-[9px] text-gray-500 flex items-center justify-end gap-1 pt-1">
                <span>12:30 PM</span>
                <span className="text-sky-500 font-bold">✓✓</span>
              </div>
            </div>

            <div className="mt-3 text-center text-[11px] text-gray-500 font-medium">
              📱 Formatted to pull WhatsApp traffic straight back to jalsasalana.ng
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <button
              onClick={handleCopy}
              className="w-full py-3 rounded-2xl bg-[#003333] hover:bg-[#024542] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
            >
              {copied ? <Check className="w-4 h-4 text-[#b0e892]" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Broadcast Copied to Clipboard!' : 'Copy Full Broadcast Text'}</span>
            </button>

            <button
              onClick={handleCopyStatus}
              className="w-full py-2.5 rounded-2xl bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              {copiedShort ? <Check className="w-4 h-4 text-emerald-600" /> : <Smartphone className="w-4 h-4 text-teal-700" />}
              <span>{copiedShort ? 'Status Quote Copied!' : 'Copy WhatsApp Status Quote (1-Line)'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
