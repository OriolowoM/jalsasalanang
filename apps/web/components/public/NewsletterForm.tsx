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
    <section className="py-12 bg-primary-dark text-white relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gold/20 text-gold mb-4 border border-gold/30">
          <Mail className="w-6 h-6" />
        </div>

        <h2 className="font-serif font-black text-2xl sm:text-3xl text-white mb-2">
          Subscribe to Jalsa Salana Nigeria Publications
        </h2>
        <p className="text-sm text-gray-300 max-w-xl mx-auto mb-6 leading-relaxed">
          Receive official communiques, caliphal discourses, quarterly theological essays, and updates regarding the upcoming 72nd Annual Convention in 2026.
        </p>

        {status === 'success' ? (
          <div className="p-4 rounded-xl bg-white/10 border border-gold/40 text-gold-light max-w-lg mx-auto flex items-center justify-center gap-2 animate-in fade-in">
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

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
              <input
                type="text"
                placeholder="Full Name (optional)"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="sm:col-span-4 px-4 py-3 rounded-lg text-sm bg-white/10 border border-white/20 text-white placeholder-gray-400 outline-none focus:border-gold transition-colors"
              />
              <input
                type="email"
                placeholder="Email Address (required)"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="sm:col-span-5 px-4 py-3 rounded-lg text-sm bg-white/10 border border-white/20 text-white placeholder-gray-400 outline-none focus:border-gold transition-colors"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="sm:col-span-3 px-5 py-3 rounded-lg bg-gold hover:bg-gold-hover text-primary-950 font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50 flex items-center justify-center shadow-lg"
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

            <p className="text-[11px] text-gray-400 mt-2">
              We respect your privacy. Unsubscribe at any time with one click.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
