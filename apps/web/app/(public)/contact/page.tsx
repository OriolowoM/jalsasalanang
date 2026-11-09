'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from 'lucide-react';
import VenueMapSection from '@/components/public/VenueMapSection';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name && form.email && form.message) {
      setSubmitted(true);
    }
  };

  return (
    <div className="py-8 sm:py-12 bg-surface-bg min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pb-6 mb-10 border-b-2 border-primary">
          <span className="text-xs font-extrabold uppercase tracking-widest text-gold-dark block mb-1">
            Inquiries &amp; Accreditation
          </span>
          <h1 className="font-serif font-black text-3xl sm:text-5xl text-charcoal">
            Contact &amp; Press Bureau
          </h1>
          <p className="text-sm text-gray-600 mt-2 max-w-2xl leading-relaxed">
            Reach the official editorial committee, submit press inquiries, request delegate information, or apply for journalist accreditation for the 72nd Jalsa Salana Nigeria 2026.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Contact Details (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-4">
              <h3 className="font-serif font-bold text-lg text-charcoal pb-3 border-b border-gray-100">
                Editorial Headquarters
              </h3>

              <div className="space-y-4 text-xs sm:text-sm text-gray-600">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-charcoal block">Ahmadiyya Muslim Jama&apos;at Nigeria</strong>
                    KM 27, Abeokuta Expressway, Ojokoro, Lagos State, Nigeria.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-charcoal block">Editorial &amp; Press Email</strong>
                    <a href="mailto:editor@jalsasalana.ng" className="text-primary hover:underline font-mono">
                      editor@jalsasalana.ng
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-charcoal block">Convention Inquiries</strong>
                    <span>+234 803 000 0000 / +234 802 000 0000</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-primary-subtle border border-primary-200">
              <h4 className="font-bold text-xs uppercase tracking-wider text-primary-dark mb-1">
                Media Accreditation 2026
              </h4>
              <p className="text-xs text-gray-600 leading-relaxed mb-3">
                Print, broadcast, and digital journalists seeking official access to the media gallery and press briefings at Jamia Ilaro must register at least 30 days prior to the opening session.
              </p>
              <div className="text-xs font-semibold text-primary">
                Press Officer: press@jalsasalana.ng
              </div>
            </div>
          </div>

          {/* Form (7 cols) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="font-serif font-bold text-xl text-charcoal mb-4">
              Send an Editorial Inscription
            </h3>

            {submitted ? (
              <div className="py-12 text-center space-y-3 animate-in fade-in">
                <CheckCircle className="w-12 h-12 text-primary mx-auto" />
                <h4 className="font-serif font-bold text-lg text-charcoal">Jazakallah! Message Received</h4>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Your message has been delivered to the editorial bureau. A member of the team will respond within 48 hours.
                </p>
                <button
                  type="button"
                  onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                  className="mt-4 text-xs font-bold text-primary hover:underline"
                >
                  Send another message &rarr;
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Bro. Ibrahim Yusuf"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                    Subject *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    placeholder="e.g. Media Accreditation / Historical Record Inquiry"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-primary transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                    Your Message *
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Provide details regarding your inquiry..."
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-primary transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-lg bg-primary hover:bg-primary-dark text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow"
                >
                  <Send className="w-4 h-4" />
                  <span>Transmit Message</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Interactive Venue Map & GPS Guidance */}
        <div className="mt-12">
          <VenueMapSection />
        </div>
      </div>
    </div>
  );
}
