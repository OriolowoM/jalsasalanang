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
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Authentication failed.');
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
    <div className="min-h-screen flex items-center justify-center bg-surface-bg px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        {/* Top Header */}
        <div className="bg-primary p-6 text-center text-white relative">
          <div className="relative w-16 h-16 mx-auto mb-3">
            <Image
              src="/images/jalsa-crest.png"
              alt="Jalsa Salana Nigeria"
              fill
              className="object-contain"
              priority
            />
          </div>
          <h1 className="font-serif font-black text-2xl tracking-wider text-white">
            JALSA SALANA NIGERIA
          </h1>
          <p className="text-xs uppercase font-bold tracking-widest text-gold mt-1">
            Editorial &amp; CMS Administration Portal
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8">
          {error && (
            <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                Authorized Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@jalsasalana.ng"
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-primary transition-colors text-charcoal"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1">
                Security Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-primary transition-colors text-charcoal"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-primary hover:bg-primary-dark text-white font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow"
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
          <div className="mt-6 pt-4 border-t border-gray-100 text-center">
            <div className="p-3 bg-primary-subtle border border-primary-100 rounded-lg text-xs text-primary-dark">
              <strong>Pre-configured Super Admin:</strong>
              <div className="font-mono text-[11px] mt-0.5">admin@jalsasalana.ng</div>
              <div className="font-mono text-[11px]">JalsaNigeria@2026!</div>
            </div>
            <div className="mt-4">
              <Link href="/" className="text-xs text-gray-400 hover:text-primary transition-colors">
                &larr; Return to Public Digital Magazine
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
