'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  X,
  Send,
  Mic,
  MicOff,
  Bot,
  User,
  ArrowRight,
  ExternalLink,
  RefreshCw,
  HelpCircle,
} from 'lucide-react';

interface Message {
  sender: 'user' | 'assistant';
  text: string;
  sources?: string[];
  timestamp: Date;
}

const SUGGESTED_QUESTIONS = [
  'What is the theme of 72nd Jalsa 2026?',
  'Where is Jamia Ilaro and how do I get there?',
  'What does Islam teach about social justice?',
  'Who is the National Amir of Ahmadiyya Nigeria?',
  'How do I access Holy Quran commentary on AlIslam.org?',
];

export default function AskJalsaAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'assistant',
      text: 'Assalamu Alaikum! I am Ask Jalsa AI, your intelligent guide to Jalsa Salana Nigeria conventions, history, scholarly articles, and Ahmadiyya teachings. How may I assist you today?',
      sources: ['Jalsa Salana Nigeria Knowledge Base'],
      timestamp: new Date(),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

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

      recognition.onerror = () => {
        setListening(false);
      };

      recognition.onend = () => {
        setListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (questionText?: string) => {
    const textToSend = questionText || query;
    if (!textToSend.trim() || loading) return;

    const userMessage: Message = {
      sender: 'user',
      text: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setQuery('');
    setLoading(true);

    try {
      const res = await fetch('/api/v1/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: textToSend }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        setMessages((prev) => [
          ...prev,
          {
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
      setMessages((prev) => [
        ...prev,
        {
          sender: 'assistant',
          text: 'I apologise, I encountered an issue retrieving that information. Please check your query or explore our articles directly.',
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

  return (
    <>
      {/* Floating Trigger Button with Prestige Gold & Emerald Sheen */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="group relative flex items-center gap-2.5 px-4.5 py-3 bg-gradient-to-r from-primary-night via-primary-dark to-primary hover:from-primary hover:to-primary-night text-white rounded-full shadow-emerald-glow transition-all duration-300 hover:scale-105 border-2 border-gold/50 active:scale-95"
          title="Ask Jalsa AI Assistant"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 text-gold-metallic" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-gold rounded-full animate-ping" />
          </div>
          <span className="font-display font-bold text-xs tracking-wide">
            Ask Jalsa AI
          </span>
          <span className="hidden sm:inline-block text-[10px] font-cinzel font-black uppercase px-2 py-0.5 rounded-full bg-gold/20 text-gold-metallic border border-gold/40">
            Guide
          </span>
        </button>
      </div>

      {/* Slide-in Conversational Drawer */}
      {isOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[450px] bg-white shadow-2xl flex flex-col border-l border-gold/30 animate-in slide-in-from-right duration-250">
          {/* Drawer Header with Royal Islamic Emerald Styling */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-primary-night via-primary-dark to-primary text-white flex items-center justify-between border-b border-gold/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gold/20 border border-gold/40 flex items-center justify-center text-gold shadow-gold-glow">
                <Bot className="w-5 h-5 text-gold-metallic" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base tracking-wide text-white flex items-center gap-2">
                  <span>Ask Jalsa AI</span>
                  <span className="text-[9px] font-cinzel font-black bg-gold text-primary-950 px-2 py-0.5 rounded-full uppercase shadow">
                    Assistant
                  </span>
                </h3>
                <p className="text-[11px] text-gray-300 font-serif">
                  Grounded on Ahmadiyya archives &amp; AlIslam.org
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-gray-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Question Chips */}
          <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200 overflow-x-auto flex items-center gap-2 no-scrollbar">
            <span className="text-[10px] font-bold uppercase text-gray-400 flex items-center gap-1 flex-shrink-0">
              <HelpCircle className="w-3 h-3 text-gold" />
              Suggestions:
            </span>
            {SUGGESTED_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                disabled={loading}
                className="text-[11px] whitespace-nowrap px-2.5 py-1 bg-white border border-gray-200 rounded-full hover:border-primary hover:text-primary transition-colors text-charcoal font-medium shadow-2xs"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-surface-bg text-xs">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-primary text-white flex-shrink-0 flex items-center justify-center mt-0.5">
                    <Bot className="w-4 h-4 text-gold" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-primary text-white rounded-tr-none'
                      : 'bg-white text-charcoal border border-gray-200 rounded-tl-none font-serif text-[13px]'
                  }`}
                >
                  <div className="whitespace-pre-line">{msg.text}</div>

                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-gray-100 flex flex-wrap items-center gap-1.5 text-[10px] text-gray-400">
                      <span className="font-bold text-gray-500">Sources:</span>
                      {msg.sources.map((src, sIdx) => (
                        <span key={sIdx} className="bg-gray-100 px-1.5 py-0.5 rounded text-primary font-medium">
                          {src}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="text-[9px] text-right mt-1 opacity-60">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-gold/30 text-gold-dark flex-shrink-0 flex items-center justify-center mt-0.5 font-bold text-xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-gray-500 font-medium pl-10">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-primary" />
                <span>Consulting Jalsa archives &amp; Ahmadiyya resources...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Bar */}
          <div className="p-3 bg-white border-t border-gray-200">
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
                  placeholder={listening ? 'Listening to your voice...' : 'Ask about Jalsa 2026, history, themes...'}
                  className={`w-full px-3.5 py-2.5 text-xs border rounded-xl focus:outline-none transition-colors pr-9 ${
                    listening ? 'border-red-500 ring-2 ring-red-100 bg-red-50/30' : 'border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary'
                  }`}
                />
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`absolute right-2.5 top-2.5 p-1 rounded-full transition-colors ${
                    listening ? 'text-red-600 animate-pulse' : 'text-gray-400 hover:text-primary'
                  }`}
                  title={listening ? 'Stop recording' : 'Voice search'}
                >
                  {listening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading || !query.trim()}
                className="p-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl disabled:opacity-40 transition-colors shadow-sm"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-2 text-center text-[10px] text-gray-400">
              Powered by Google Gemini &amp; Official Jalsa Salana Nigeria Archives
            </div>
          </div>
        </div>
      )}
    </>
  );
}
