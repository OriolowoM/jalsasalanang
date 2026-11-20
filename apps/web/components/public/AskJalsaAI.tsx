'use client';

import React, { useState, useRef, useEffect, useContext, useMemo } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  X,
  Send,
  Mic,
  MicOff,
  Bot,
  User,
  ExternalLink,
  RefreshCw,
  Copy,
  Check,
  ChevronRight,
  ShieldCheck,
  PhoneCall,
  MapPin,
  Music,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AudioPlayerContext } from '@/context/AudioPlayerContext';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  sources?: string[];
  timestamp: Date;
}

interface QuickPrompt {
  id: string;
  icon: string;
  label: string;
  desc: string;
  query: string;
  lang?: 'en' | 'yo' | 'ha' | 'pcm';
}

function getTimeAwarePrompts(): { period: string; timeLabel: string; prompts: QuickPrompt[] } {
  // Current hour in WAT (UTC+1)
  const now = new Date();
  const watHour = (now.getUTCHours() + 1) % 24;

  if (watHour >= 4 && watHour < 10) {
    return {
      period: 'morning',
      timeLabel: 'Morning Worship & Hospitality (04:00 – 10:00 WAT)',
      prompts: [
        {
          id: 'breakfast',
          icon: '☕',
          label: 'When is Breakfast?',
          desc: '8:00 AM daily after Dars at Main Dining & Lajna Annex',
          query: 'When and where is breakfast served at Jalsa 2026?',
          lang: 'en',
        },
        {
          id: 'dars',
          icon: '🌅',
          label: 'Today’s Morning Dars Topic',
          desc: 'Spiritual discourse topics & assigned facilitators',
          query: 'What is the morning Dars topic and facilitator today?',
          lang: 'en',
        },
        {
          id: 'travel-lagos',
          icon: '🚗',
          label: 'Lagos to Ilaro Route',
          desc: 'Meran/Kola → Ota → Atan-Owode to avoid Papalanto',
          query: 'Which recommended route should I take from Lagos to Ilaro?',
          lang: 'en',
        },
        {
          id: 'yo-ounje',
          icon: '🇳🇬',
          label: 'Nígbà wo ni Oúnjẹ Àárọ̀? (Yorùbá)',
          desc: 'Àkókò oúnjẹ àárọ̀ àti àwọn ibi ìjẹun ní Ilaro',
          query: 'Nigba wo ni ounjẹ aarọ ma wa lẹhin dars ni Jalsa?',
          lang: 'yo',
        },
      ],
    };
  } else if (watHour >= 10 && watHour < 16) {
    return {
      period: 'afternoon',
      timeLabel: 'Midday Sessions & Congregational Prayers',
      prompts: [
        {
          id: 'prayers',
          icon: '🕌',
          label: 'When is Jumu’ah / Zuhr Prayer?',
          desc: 'Adhan & prayer timings across convention marquees',
          query: 'When is Jumu’ah or Zuhr and Asr prayer today?',
          lang: 'en',
        },
        {
          id: 'lunch',
          icon: '🍱',
          label: 'When is Lunch served?',
          desc: 'Traditional free communal meal schedule',
          query: 'When and where is lunch served at Jalsa 2026?',
          lang: 'en',
        },
        {
          id: 'market',
          icon: '🛍️',
          label: 'How to Book a Market Stall?',
          desc: 'Standard stall ₦16k, open space ₦11k, liaison desk',
          query: 'How much is a stall at Jalsa Market and who is the liaison officer?',
          lang: 'en',
        },
        {
          id: 'jingle-play',
          icon: '🎧',
          label: 'Play Yoruba / Hausa Jingle',
          desc: 'Official 4-language theme anthems & radio pack',
          query: 'Play the Yoruba or Hausa Jalsa jingle audio',
          lang: 'en',
        },
      ],
    };
  } else if (watHour >= 16 && watHour < 21) {
    return {
      period: 'evening',
      timeLabel: 'Evening Keynote & Communal Dinner',
      prompts: [
        {
          id: 'flag-opening',
          icon: '🚩',
          label: 'Flag Hoisting & Opening Time',
          desc: 'Friday 5:00 PM Liwa-i-Ahmadiyya hoisting & Inaugural',
          query: 'What time is Flag Hoisting and the Opening Session on Friday?',
          lang: 'en',
        },
        {
          id: 'dinner',
          icon: '🍲',
          label: 'When is Dinner served?',
          desc: '7:30 PM after Maghrib & Ishaa prayers',
          query: 'When and where is dinner served at Jalsa 2026?',
          lang: 'en',
        },
        {
          id: 'keynote',
          icon: '🎙️',
          label: 'Who is tonight’s Keynote Speaker?',
          desc: 'Observing Justice & Human Rights theme lecture',
          query: 'Who is the speaker for the keynote lecture and what is the topic?',
          lang: 'en',
        },
        {
          id: 'ha-hanya',
          icon: '🇳🇬',
          label: 'Hanyar Ilaro daga Ibadan (Hausa)',
          desc: 'Hanyar Itori da Ita-Oshin domin kauce wa cunkoso',
          query: 'Wace hanya ce mafi kyau daga Ibadan zuwa Ilaro domin kauce wa cunkoso?',
          lang: 'ha',
        },
      ],
    };
  } else {
    return {
      period: 'night',
      timeLabel: 'Night Deliberations & Overnight Care',
      prompts: [
        {
          id: 'qa-panel',
          icon: '❓',
          label: 'Who is on tonight’s Q&A panel?',
          desc: 'Saturday night Faith & Science general symposium',
          query: 'Who is on the Saturday night Q&A panel and Faith Symposium?',
          lang: 'en',
        },
        {
          id: 'abeokuta-night',
          icon: '🛏️',
          label: 'Overnight Stay in Abeokuta',
          desc: 'If reaching Abeokuta by 7:00 PM, sleep until morning',
          query: 'What should I do if I reach Abeokuta after 7:00 PM?',
          lang: 'en',
        },
        {
          id: 'medical-desk',
          icon: '🚑',
          label: 'Emergency & Medical Clinic Desk',
          desc: '24/7 volunteer doctors, pharmacy & ambulance desk',
          query: 'Where is the Central Medical Clinic and emergency contact number?',
          lang: 'en',
        },
        {
          id: 'theme-2026',
          icon: '📖',
          label: 'Official 2026 Theme',
          desc: 'Observing Justice and Human Rights for Global Peace',
          query: 'What is the official theme of the 72nd Jalsa Salana Nigeria 2026?',
          lang: 'en',
        },
      ],
    };
  }
}

const MULTILINGUAL_PRESETS: { code: string; label: string; query: string }[] = [
  { code: 'yo', label: '🇳🇬 Yorùbá: Oúnjẹ & Ọ̀nà', query: 'Nigba wo ni ounjẹ aarọ ati bawo ni mo ṣe le de Ilaro lati Eko?' },
  { code: 'ha', label: '🇳🇬 Hausa: Karin Kumallo', query: 'Yaushe za a fara karin kumallo kuma wace hanya ce daga Ibadan?' },
  { code: 'pcm', label: '🇳🇬 Pidgin: Food & Route', query: 'How I fit reach Ilaro safely and which time food dey ready?' },
  { code: 'market', label: '🛍️ Market Booking', query: 'How much is a stall at Jalsa Market 2026 and who do I contact?' },
];

export default function AskJalsaAI() {
  const audioContext = useContext(AudioPlayerContext);
  const isMiniPlayerActive = audioContext?.isMiniPlayerActive ?? false;

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const timePrompts = useMemo(() => getTimeAwarePrompts(), []);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Assalamu Alaikum wa Rahmatullah! I am the **Jalsa Companion**, your intelligent assistant for Jalsa Salana Nigeria conventions, logistics, travel advisories, and spiritual literature. How may I assist your pilgrimage today?',
      sources: ['Jalsa Salana Nigeria Secretariat', 'Jamia Ilaro Grounds Management'],
      timestamp: new Date(),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Listen for external trigger events (e.g. from Programme page or HeroCompanionBar)
  useEffect(() => {
    const handleExternalOpen = (event: any) => {
      setIsOpen(true);
      const text = event?.detail?.query || event?.detail?.prompt;
      if (text) {
        setTimeout(() => {
          handleSend(text);
        }, 300);
      }
    };

    window.addEventListener('open-jalsa-ai', handleExternalOpen);
    window.addEventListener('jalsa-ai:ask', handleExternalOpen);
    return () => {
      window.removeEventListener('open-jalsa-ai', handleExternalOpen);
      window.removeEventListener('jalsa-ai:ask', handleExternalOpen);
    };
  }, []);

  // Initialize Speech Recognition if supported
  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        setListening(false);
      };

      recognition.onerror = () => setListening(false);
      recognition.onend = () => setListening(false);

      recognitionRef.current = recognition;
    }
  }, []);

  // Auto-scroll to bottom & handle Escape key
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [messages, isOpen, loading]);

  const handleSend = async (questionText?: string) => {
    const textToSend = questionText || query;
    if (!textToSend.trim() || loading) return;

    const userMessage: Message = {
      id: String(Date.now()),
      sender: 'user',
      text: textToSend,
      timestamp: new Date(),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setQuery('');
    setLoading(true);

    try {
      // Build lightweight conversation history for multi-turn context
      const formattedHistory = newHistory.slice(-6).map((m) => ({
        role: m.sender === 'user' ? ('user' as const) : ('model' as const),
        content: m.text,
      }));

      // Query Express AI API directly for maximum speed and zero server loopback latency
      let res: Response | null = await fetch('/api/v1/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: textToSend,
          history: formattedHistory,
        }),
      }).catch(() => null);

      if (!res || !res.ok) {
        res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: textToSend,
            history: formattedHistory,
          }),
        });
      }

      const data = await res.json();
      if (data.success && data.data) {
        setMessages((prev) => [
          ...prev,
          {
            id: String(Date.now() + 1),
            sender: 'assistant',
            text: data.data.answer,
            sources: data.data.sources,
            timestamp: new Date(),
          },
        ]);
      } else {
        throw new Error(data.message || 'Unable to retrieve answer.');
      }
    } catch {
      const q = textToSend.toLowerCase();
      let fallbackText = '';
      let fallbackSources = ['Jalsa Salana Nigeria Secretariat'];

      if (q.includes('theme') || q.includes('topic')) {
        fallbackText = 'The official theme of the **72nd Jalsa Salana Nigeria 2026** is:\n\n**“Observing Justice and Human Rights: The foundation for true Global Peace”**\n\nConvening from Friday, 18th to Sunday, 20th December 2026 at Jamia Ahmadiyya Ilaro, Ogun State.';
        fallbackSources = ['Official 2026 Convention Theme', '/programme-of-events-jalsa-salana-nigeria-2026'];
      } else if (
        q.includes('jingle') ||
        q.includes('sound of jalsa') ||
        q.includes('audio') ||
        q.includes('song') ||
        q.includes('radio pack') ||
        q.includes('anthem')
      ) {
        let selectedLang: 'en' | 'yo' | 'ha' | 'ar' = 'en';
        let langName = 'English';
        if (q.includes('yoruba') || q.includes('yo')) {
          selectedLang = 'yo';
          langName = 'Yoruba';
        } else if (q.includes('hausa') || q.includes('ha')) {
          selectedLang = 'ha';
          langName = 'Hausa';
        } else if (q.includes('arabic') || q.includes('ar')) {
          selectedLang = 'ar';
          langName = 'Arabic';
        }

        // Trigger playback in audio context
        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent('jalsa-audio:play', {
              detail: { language: selectedLang, autoPlay: true },
            })
          );
        }

        fallbackText = `Assalamu Alaikum! Now playing the official **${langName} Jingle** for the **72nd Jalsa Salana Nigeria 2026**! 🎵\n\n` +
          `• **Theme:** “Observing Justice and Human Rights: The foundation for true Global Peace”\n` +
          `• **Direct Link:** [Listen to ${langName} Jingle](/#jingle-${selectedLang})\n` +
          `• **Download MP3:** [/audio/jalsa-2026-${selectedLang}.mp3](/audio/jalsa-2026-${selectedLang}.mp3)\n\n` +
          `You can also download the complete 4-language radio pack here: [Download All 4 Jingles ZIP (10.6 MB)](/audio/jalsa-2026-jingles-pack.zip).`;
        fallbackSources = ['Sound of Jalsa 2026', `/#jingle-${selectedLang}`];
      } else if (q.includes('market') || q.includes('stall') || q.includes('vendor') || q.includes('trader')) {
        fallbackText = 'For the **Jalsa Salana 2026 Market**:\n- **Standard Stall:** ₦16,000\n- **Open Space:** ₦11,000\n- **Form Fee:** ₦1,000 non-refundable\n- **Submission Deadline:** 1st December 2026\n- **Operating Hours:** 7:00 AM – 10:00 PM (strictly closed during Jalsa sessions & prayers).\n- **Strict Prohibitions:** No alcohol, no media/books, no firewood/charcoal, and only Liman brand water is allowed.\n\n**Official Market Liaison Officers (Contact for Booking & Payment):**\n- **Ilaro / Central Operations:** Bro. Alaka Mahmud (+234 706 337 4914)\n- **Lagos State:** Bro. Olawale Utman (+234 808 312 7892)\n- **Abeokuta / Ogun:** Bro. Muiz Ajayi (+234 806 749 3314)\n\nVisit the official **[Jalsa Market Page](/market)** to connect directly with the liaison desk.';
        fallbackSources = ['Official Market Guidelines 2026', '/market'];
      } else if (q.includes('programme') || q.includes('schedule') || q.includes('flag') || q.includes('hoisting') || q.includes('opening session')) {
        fallbackText = 'The official **72nd Jalsa Salana Nigeria 2026 Programme of Events**:\n- **Opening Ceremony & Flag Hoisting:** Friday 18 Dec at **5:00 PM** (Liwa-i-Ahmadiyya & Nigeria National Flag).\n- **First Session:** Friday at **5:10 PM**, including Lecture One with message from Hazrat Khalifatul Masih V (aba).\n- **Keynote Theme Lecture:** Saturday 19 Dec at 10:40 AM.\n- **Concluding Address:** Sunday 20 Dec at 6:30 AM.\n\nExplore the interactive schedule and download the official PDF on the **[Programme of Events Page](/programme-of-events-jalsa-salana-nigeria-2026)**.';
        fallbackSources = ['Official 2026 Programme of Events', '/programme-of-events-jalsa-salana-nigeria-2026'];
      } else if (q.includes('date') || q.includes('when') || q.includes('time') || q.includes('2026') || q.includes('72')) {
        fallbackText = 'The **72nd Jalsa Salana Nigeria** will be held from **Friday, December 18 to Sunday, December 20, 2026** at **Jamia Ahmadiyya Ilaro, Ogun State, Nigeria** under the spiritual direction of Hazrat Mirza Masroor Ahmad (aba).';
        fallbackSources = ['Convention Schedule', '/editions/2026'];
      } else if (q.includes('where') || q.includes('venue') || q.includes('location') || q.includes('ilaro')) {
        fallbackText = 'The convention takes place at **Jamia Ahmadiyya Ilaro, Ogun State, Nigeria** (GPS: 6.8872° N, 3.0142° E). Vehicle arrivals enter via Gate 1 (North Expressway Gate) and pedestrian registration is at Gate 2 (West Hub).';
        fallbackSources = ['Jamia Ilaro Grounds Management', '/contact'];
      } else if (q.includes('register') || q.includes('badge') || q.includes('tag') || q.includes('portal')) {
        fallbackText = 'You can register online for the convention at **[jalsa.ahmadiyyanigeria.net](https://jalsa.ahmadiyyanigeria.net)** or visit our **[Registration Hub](/registration)**. Pre-registration gives you an instant digital credential pass to bypass queues.';
        fallbackSources = ['National Registration Committee', '/registration'];
      } else if (q.includes('food') || q.includes('dining') || q.includes('meal')) {
        fallbackText = 'Complimentary hospitality meals (breakfast, lunch, and dinner) are served daily to all registered delegates at the Main Dining Marquee (Men) and Lajna Dining Pavilion (Women).';
        fallbackSources = ['Hospitality & Ziafat Directorate'];
      } else if (q.includes('medical') || q.includes('doctor') || q.includes('clinic') || q.includes('emergency')) {
        fallbackText = 'The Central Ahmadiyya Medical Clinic operates 24/7 on the convention grounds with volunteer doctors, nursing staff, and emergency ambulances. For urgent assistance: **+234 803 525 7264**.';
        fallbackSources = ['Central Medical Team'];
      } else {
        fallbackText = 'Welcome to Jalsa Salana Nigeria. I am here to assist with convention dates (Dec 18–20, 2026), venue directions at Jamia Ilaro, online registration, prayer schedules, and dining. You can also contact our Secretariat at **+234-803-JALSA-NG**.';
        fallbackSources = ['Secretariat Hotline: +234 803 525 7264'];
      }

      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 2),
          sender: 'assistant',
          text: fallbackText,
          sources: fallbackSources,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Voice input is supported in Chrome, Edge, and Safari.');
      return;
    }

    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setListening(true);
      } catch {
        setListening(false);
      }
    }
  };

  const copyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatText = (text: string) => {
    // Basic bold markdown renderer
    return text.split('\n').map((line, idx) => {
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      return (
        <p key={idx} className={line.trim() === '' ? 'h-2' : 'mb-1.5 leading-relaxed'}>
          {parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={pIdx} className="font-bold text-forest">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <>
      {/* ── Floating Trigger Button: Impeccable Contrast, dynamically offset if mini-player is active on mobile ── */}
      <div
        className={`fixed right-4 sm:right-6 z-40 transition-all duration-300 ${
          isMiniPlayerActive ? 'bottom-22 sm:bottom-6' : 'bottom-6'
        }`}
      >
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-3 px-5 py-3.5 bg-[#003333] hover:bg-[#002626] text-white rounded-full shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-gold/70 ring-2 ring-forest/20"
          title="Open Jalsa Companion AI"
          aria-label="Open Jalsa Companion AI"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 text-gold-metallic group-hover:rotate-12 transition-transform duration-300" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-lime rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-lime rounded-full" />
          </div>

          <div className="text-left flex flex-col">
            <span className="font-display font-extrabold text-xs tracking-wider text-white drop-shadow-sm uppercase">
              Ask Jalsa AI
            </span>
            <span className="text-[9px] font-sans font-medium text-lime/90 -mt-0.5">
              Smart Concierge
            </span>
          </div>

          <span className="text-[10px] font-display font-bold uppercase px-2 py-0.5 rounded-full bg-gold/20 text-gold-foil border border-gold/40">
            Guide
          </span>
        </button>
      </div>

      {/* ── Glassmorphism Full Modal Dialogue with Framer Motion ── */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden">
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-forest-950/70 backdrop-blur-md"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-teal/20 flex flex-col max-h-[85vh] sm:max-h-[88vh] overflow-hidden z-10"
            >
              {/* Header */}
              <div className="p-4 sm:p-5 bg-gradient-to-r from-forest-950 via-forest to-forest-900 text-white flex items-center justify-between border-b border-teal/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-teal/30 border border-lime/40 flex items-center justify-center text-lime shadow-soft">
                    <Bot className="w-5 h-5 text-lime" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-extrabold text-base tracking-wide text-white">
                        Jalsa Companion
                      </h3>
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-lime text-forest-950 font-sans uppercase">
                        AI Active
                      </span>
                    </div>
                    <p className="text-[11px] text-white/70">
                      Smart logistics, convention guidance &amp; scholarly archives
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setMessages([
                        {
                          id: 'reset',
                          sender: 'assistant',
                          text: 'Session refreshed. How can I assist you with Jalsa Salana Nigeria?',
                          timestamp: new Date(),
                        },
                      ]);
                    }}
                    title="Clear Conversation"
                    className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                    aria-label="Close assistant"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Chat Messages Body */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-surface-bg/50">
                {messages.map((m) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {m.sender === 'assistant' && (
                      <div className="w-8 h-8 rounded-full bg-teal text-white flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                        <Sparkles className="w-4 h-4 text-lime" />
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm shadow-soft ${
                        m.sender === 'user'
                          ? 'bg-teal text-white rounded-tr-none'
                          : 'bg-white text-ink-body border border-surface-border rounded-tl-none'
                      }`}
                    >
                      {formatText(m.text)}

                      {/* Source attribution badges */}
                      {m.sources && m.sources.length > 0 && (
                        <div className="mt-3 pt-2.5 border-t border-surface-border/60 flex flex-wrap items-center gap-1.5 text-[10px] text-ink-muted">
                          <span className="font-bold text-teal flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> Grounded in:
                          </span>
                          {m.sources.map((src, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md bg-surface-muted text-ink-body font-medium"
                            >
                              {src}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Message Actions */}
                      {m.sender === 'assistant' && (
                        <div className="mt-2 flex items-center justify-between text-[10px] text-ink-light pt-1">
                          <span>
                            {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <button
                            onClick={() => copyText(m.id, m.text)}
                            className="flex items-center gap-1 text-ink-muted hover:text-teal transition-colors"
                          >
                            {copiedId === m.id ? (
                              <>
                                <Check className="w-3 h-3 text-green" /> Copied
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" /> Copy
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>

                    {m.sender === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-forest text-white flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                        <User className="w-4 h-4" />
                      </div>
                    )}
                  </motion.div>
                ))}

                {/* Loading indicator */}
                {loading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3 justify-start"
                  >
                    <div className="w-8 h-8 rounded-full bg-teal text-white flex items-center justify-center flex-shrink-0 mt-1">
                      <Sparkles className="w-4 h-4 text-lime animate-spin" />
                    </div>
                    <div className="bg-white border border-surface-border rounded-2xl rounded-tl-none p-4 shadow-soft">
                      <div className="flex items-center gap-2 text-xs text-ink-muted font-medium">
                        <span className="w-2 h-2 rounded-full bg-teal animate-bounce" />
                        <span className="w-2 h-2 rounded-full bg-teal animate-bounce [animation-delay:0.2s]" />
                        <span className="w-2 h-2 rounded-full bg-teal animate-bounce [animation-delay:0.4s]" />
                        <span className="ml-1">Consulting Jalsa knowledge base...</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Time-Aware Quick Guidance Cards (Kills blank chat box on start) */}
                {messages.length <= 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="mt-2 rounded-2xl bg-[#f4f7f5] border border-[#d9e5e0] p-3.5 sm:p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-1.5 mb-3">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#003333]">
                        <Sparkles className="w-3.5 h-3.5 text-[#027c68]" />
                        <span>Instant Jalsa Assistance</span>
                      </div>
                      <span className="text-[10px] font-semibold text-[#027c68] bg-[#e3ece7] px-2.5 py-0.5 rounded-full">
                        {timePrompts.timeLabel.split('(')[0].trim()}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {timePrompts.prompts.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => handleSend(p.query)}
                          disabled={loading}
                          className="text-left p-2.5 rounded-xl bg-white hover:bg-[#eef5f1] border border-[#d2dfd8] hover:border-[#027c68] shadow-xs transition-all group flex items-start gap-2"
                        >
                          <span className="text-base shrink-0 group-hover:scale-110 transition-transform">
                            {p.icon}
                          </span>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-[#003333] group-hover:text-[#027c68] leading-tight">
                              {p.label}
                            </div>
                            <div className="text-[11px] text-[#556e66] line-clamp-1 mt-0.5">
                              {p.desc}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>

                    {/* Multilingual Switcher Pills */}
                    <div className="mt-3 pt-2.5 border-t border-[#dce6e1] flex flex-wrap items-center gap-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#637d75] mr-1">
                        Multilingual:
                      </span>
                      {MULTILINGUAL_PRESETS.map((item) => (
                        <button
                          key={item.code}
                          type="button"
                          onClick={() => handleSend(item.query)}
                          disabled={loading}
                          className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-white hover:bg-[#003333] hover:text-white text-[#1f3b34] transition border border-[#d2dfd8] shadow-xs"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Dynamic Time-Aware & Multilingual Pills Above Input */}
              <div className="flex-shrink-0 px-3 sm:px-4 py-2.5 bg-[#f8faf8] border-t border-surface-border overflow-x-auto no-scrollbar">
                <div className="flex items-center gap-1.5 whitespace-nowrap min-h-[32px]">
                  <span className="text-[10px] font-bold uppercase tracking-wider flex-shrink-0 bg-[#b0e892]/40 text-[#003333] px-2 py-1 rounded-md">
                    Quick Prompts
                  </span>
                  {timePrompts.prompts.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleSend(p.query)}
                      disabled={loading}
                      className="text-xs px-3 py-1 bg-white hover:bg-[#003333] hover:text-white text-[#152e27] font-medium rounded-full border border-[#cfdcd6] shadow-xs transition-all flex-shrink-0 disabled:opacity-50 active:scale-95 flex items-center gap-1"
                    >
                      <span>{p.icon}</span>
                      <span>{p.label}</span>
                    </button>
                  ))}
                  {MULTILINGUAL_PRESETS.map((item) => (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => handleSend(item.query)}
                      disabled={loading}
                      className="text-xs px-2.5 py-1 bg-[#f0f5f3] hover:bg-[#003333] hover:text-white text-[#152e27] font-medium rounded-full border border-[#cfdcd6] shadow-xs transition-all flex-shrink-0 disabled:opacity-50 active:scale-95"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Footer */}
              <div className="flex-shrink-0 p-3 sm:p-4 bg-white border-t border-surface-border">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="flex items-center gap-2"
                >
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder={
                        listening
                          ? 'Listening to voice query...'
                          : 'Ask anything about Jalsa 2026, gates, dining, themes...'
                      }
                      className={`w-full px-4 py-3 text-xs sm:text-sm border rounded-2xl focus:outline-none transition-all pr-10 ${
                        listening
                          ? 'border-red-500 ring-2 ring-red-100 bg-red-50/20'
                          : 'border-surface-border focus:border-teal focus:ring-2 focus:ring-teal/20'
                      }`}
                    />

                    <button
                      type="button"
                      onClick={toggleListening}
                      className={`absolute right-3 top-3 p-1 rounded-full transition-colors ${
                        listening ? 'text-red-600 animate-pulse' : 'text-ink-light hover:text-teal'
                      }`}
                      title={listening ? 'Stop listening' : 'Speak your question'}
                    >
                      {listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !query.trim()}
                    className="p-3 bg-teal hover:bg-teal-700 text-white rounded-2xl disabled:opacity-40 transition-all shadow-glow-teal flex-shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>

                <div className="mt-2.5 flex items-center justify-between text-[10px] text-ink-light">
                  <span>Jalsa Salana Intelligent Concierge &amp; Official Archives</span>
                  <div className="flex items-center gap-2">
                    <Link
                      href="/live-crowd"
                      onClick={() => setIsOpen(false)}
                      className="hover:text-teal font-medium flex items-center gap-0.5"
                    >
                      <MapPin className="w-3 h-3" /> Live Grounds Map
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
