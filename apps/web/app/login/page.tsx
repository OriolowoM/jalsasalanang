'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Lock, Mail, AlertCircle, Loader2, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('admin@jalsasalana.ng');
  const [password, setPassword] = useState('JalsaNigeria@2026!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        let msg = data.message || 'Authentication failed. Please verify your email and password.';
        if (msg.includes('Prisma') || msg.includes('Query Engine')) {
          msg = 'Database engine is initializing. Please ensure the latest server package is extracted and try again.';
        }
        throw new Error(msg);
      }

      // Store user info in localStorage for quick client access
      if (typeof window !== 'undefined') {
        localStorage.setItem('jalsa_user', JSON.stringify(data.user));
      }

      router.push('/admin');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-bg px-4 py-8 sm:py-16">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-soft-lg border border-surface-border/60 overflow-hidden">
        {/* Top Header */}
        <div className="bg-gradient-to-br from-forest to-forest-950 p-6 sm:p-8 text-center text-white relative">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3">
            <Image
              src="/images/jalsa-emblem.png"
              alt="Jalsa Salana Official Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h1 className="font-display font-extrabold text-xl sm:text-2xl tracking-wider text-white">
            JALSA SALANA NIGERIA
          </h1>
          <p className="text-[10px] sm:text-xs uppercase font-display font-bold tracking-[0.2em] text-lime mt-1">
            Editorial &amp; CMS Administration Portal
          </p>
        </div>

        {/* Form Body */}
        <div className="p-5 sm:p-8">
          {error && (
            <div className="mb-5 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 leading-relaxed">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-display font-bold uppercase tracking-wider text-forest mb-1.5">
                Authorized Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-ink-muted absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@jalsasalana.ng"
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border border-surface-border text-sm outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-all text-ink font-medium bg-surface-bg"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-display font-bold uppercase tracking-wider text-forest mb-1.5">
                Security Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-ink-muted absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border border-surface-border text-sm outline-none focus:border-teal focus:ring-1 focus:ring-teal transition-all text-ink font-medium bg-surface-bg"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl bg-teal hover:bg-teal-600 text-white font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-glow-teal hover:shadow-lg active:scale-[0.99] mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Editorial CMS</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Demonstration Notice */}
          <div className="mt-6 pt-5 border-t border-surface-border/60 text-center">
            <div className="p-3.5 bg-teal-50 border border-teal-200/80 rounded-2xl text-xs text-forest">
              <strong className="text-teal font-display block uppercase tracking-wider text-[11px] mb-1">
                Authorized Super Admin Access
              </strong>
              <div className="font-mono text-xs text-ink-body font-semibold">admin@jalsasalana.ng</div>
              <div className="font-mono text-xs text-ink-muted mt-0.5">JalsaNigeria@2026!</div>
            </div>
            <div className="mt-4">
              <Link href="/" className="text-xs text-ink-muted hover:text-teal transition-colors font-medium">
                &larr; Return to Public Digital Magazine
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
