'use client';

import React, { useState } from 'react';
import { Mail, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { subscribeNewsletter } from '@/lib/api';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [websiteHp, setWebsiteHp] = useState(''); // Spam honeypot
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('loading');
    setMessage('');

    try {
      const res = await subscribeNewsletter(email.trim(), fullName.trim(), websiteHp);
      if (res.success) {
        setStatus('success');
        setMessage(res.message || 'Jazakallah! You have successfully subscribed.');
        setEmail('');
        setFullName('');
      } else {
        setStatus('error');
        setMessage(res.message || 'Unable to subscribe. Please try again.');
      }
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message || 'A network error occurred. Please try again.');
    }
  };

  return (
    <section className="py-20 sm:py-24 bg-forest text-white relative overflow-hidden border-t border-teal/15">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-teal/20 text-lime mb-5 border border-teal/30">
          <Mail className="w-7 h-7" />
        </div>

        <h2 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-white mb-3 tracking-tight">
          Subscribe to Jalsa Salana Nigeria Publications
        </h2>
        <p className="text-base text-white/70 max-w-xl mx-auto mb-8 leading-relaxed font-sans">
          Receive official communiques, caliphal discourses, quarterly theological essays, and updates regarding the upcoming 72nd Annual Convention in 2026.
        </p>

        {status === 'success' ? (
          <div className="p-5 rounded-2xl bg-teal/20 border border-teal/30 text-lime max-w-lg mx-auto flex items-center justify-center gap-3 animate-in fade-in">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-semibold">{message}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-3">
            {/* Hidden honeypot field for bot spam */}
            <input
              type="text"
              name="website_hp"
              value={websiteHp}
              onChange={(e) => setWebsiteHp(e.target.value)}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
              <input
                type="text"
                placeholder="Full Name (optional)"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="sm:col-span-4 px-4 py-3.5 rounded-2xl text-sm bg-white/10 border border-white/15 text-white placeholder-white/40 outline-none focus:border-teal transition-colors font-sans"
              />
              <input
                type="email"
                placeholder="Email Address (required)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="sm:col-span-5 px-4 py-3.5 rounded-2xl text-sm bg-white/10 border border-white/15 text-white placeholder-white/40 outline-none focus:border-teal transition-colors font-sans"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="sm:col-span-3 px-6 py-3.5 rounded-2xl bg-teal hover:bg-teal-500 text-white font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50 flex items-center justify-center shadow-glow-teal font-display"
              >
                {status === 'loading' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  'Subscribe'
                )}
              </button>
            </div>

            {status === 'error' && (
              <div className="flex items-center justify-center gap-1.5 text-xs text-red-300 mt-2">
                <AlertCircle className="w-4 h-4" />
                <span>{message}</span>
              </div>
            )}

            <p className="text-xs text-white/40 mt-3 font-sans">
              We respect your privacy. Unsubscribe at any time with one click.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
