import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  FileText, 
  Home as HomeIcon, 
  Truck, 
  Shield, 
  PhoneCall, 
  ExternalLink
} from 'lucide-react';

export default function EditorialFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-forest text-white border-t border-teal/15 mt-auto relative overflow-hidden">
      {/* Subtle background stars */}
      <div className="absolute inset-0 bg-islamic-stars opacity-15 pointer-events-none" />

      {/* Top Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">
          
          {/* Col 1: Brand & Jama'at Summary (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <Link href="/" className="flex items-center gap-3.5 group">
              <div className="relative w-12 h-12 flex-shrink-0 group-hover:scale-105 transition-transform">
                <Image
                  src="/images/jalsa-emblem.png"
                  alt="Jalsa Salana Official Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <span className="font-display font-extrabold text-xl tracking-[0.06em] text-white block group-hover:text-lime transition-colors">
                  JALSA SALANA
                </span>
                <span className="text-[10px] uppercase font-bold tracking-[0.22em] text-lime/80 block">
                  Nigeria — Digital Publication
                </span>
              </div>
            </Link>

            <p className="text-xs text-white/70 leading-relaxed font-sans">
              Jalsa Salana Nigeria is the premier annual spiritual, educational, and intellectual gathering of the Ahmadiyya Muslim Jama&apos;at Nigeria, dedicated to peace, moral reformation, and divine guidance under the blessed institution of Khilafat-e-Ahmadiyya.
            </p>

            {/* Official 72nd Edition Logo Badge */}
            <div className="pt-2">
              <span className="text-[10px] uppercase font-display font-bold tracking-[0.2em] text-lime/80 block mb-2">
                Upcoming Convention
              </span>
              <div className="inline-block bg-white/95 px-3.5 py-1.5 rounded-xl shadow-soft border border-white/20">
                <div className="relative h-8 w-36 sm:w-44">
                  <Image
                    src="/images/jalsa72-logo.jpg"
                    alt="72nd Jalsa Salana Nigeria 2026 Official Logo"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>

            <div className="text-[11px] text-white/50 border-l-2 border-lime/40 pl-3 italic">
              &ldquo;Love for All, Hatred for None&rdquo; — Universal motto of the Ahmadiyya Muslim Community.
            </div>
          </div>

          {/* Col 2: Digital Magazine & Columns (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-display font-bold text-xs uppercase tracking-[0.2em] text-lime">
              Official Blog
            </h4>
            <ul className="space-y-2.5 text-xs text-white/70 font-medium">
              <li>
                <Link href="/registration" className="text-lime font-bold hover:underline flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-lime animate-ping"></span>
                  Registration &amp; Tags Hub 2026
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-lime transition-colors">
                  All Blog Articles (148)
                </Link>
              </li>
              <li>
                <Link href="/blog?category=amirs-corner" className="hover:text-lime transition-colors flex items-center justify-between">
                  <span>Amir&apos;s Corner</span>
                  <span className="text-[9px] bg-teal-600/50 text-lime font-bold px-1.5 py-0.5 rounded">Official</span>
                </Link>
              </li>
              <li>
                <Link href="/blog?category=convention-lectures" className="hover:text-lime transition-colors">
                  Convention Lectures &amp; Papers
                </Link>
              </li>
              <li>
                <Link href="/blog?category=press-conference" className="hover:text-lime transition-colors">
                  Press Conferences &amp; Communiques
                </Link>
              </li>
              <li>
                <Link href="/speeches" className="hover:text-lime transition-colors">
                  Speeches &amp; Audio Transcripts
                </Link>
              </li>
              <li>
                <Link href="/categories/poems-reflections" className="hover:text-lime transition-colors">
                  Poems &amp; Personal Memories
                </Link>
              </li>
              <li>
                <Link href="/galleries" className="hover:text-lime transition-colors">
                  Photography &amp; Video Galleries
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Event Attendees & Logistics (2.5 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h4 className="font-display font-bold text-xs uppercase tracking-[0.2em] text-lime">
              Event Logistics
            </h4>
            <ul className="space-y-2.5 text-xs text-white/70">
              <li>
                <Link href="/programme-of-events-jalsa-salana-nigeria-2026" className="hover:text-lime transition-colors flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-teal-400" />
                  <span>Programme timetable 2026</span>
                </Link>
              </li>
              <li>
                <Link href="/market" className="hover:text-lime transition-colors flex items-center gap-2">
                  <span className="w-3.5 h-3.5 text-gold font-bold text-[10px]">₦</span>
                  <span>Jalsa Market Booking</span>
                </Link>
              </li>
              <li>
                <Link href="/accommodation" className="hover:text-lime transition-colors flex items-center gap-2">
                  <HomeIcon className="w-3.5 h-3.5 text-teal-400" />
                  <span>Accommodation</span>
                </Link>
              </li>
              <li>
                <Link href="/transportation" className="hover:text-lime transition-colors flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5 text-teal-400" />
                  <span>Transportation</span>
                </Link>
              </li>
              <li>
                <Link href="/security" className="hover:text-lime transition-colors flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-teal-400" />
                  <span>Security &amp; Protocol</span>
                </Link>
              </li>
              <li>
                <Link href="/info-emergency" className="hover:text-red-300 text-red-400 font-semibold transition-colors flex items-center gap-2">
                  <PhoneCall className="w-3.5 h-3.5 text-red-400" />
                  <span>Emergency Desk</span>
                </Link>
              </li>
              <li>
                <Link href="/editions" className="hover:text-lime transition-colors">
                  Historical Editions Timeline
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Institutional & National Office (2.5 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-display font-bold text-xs uppercase tracking-[0.2em] text-lime">
              National Secretariat
            </h4>
            <p className="text-xs text-white/70 leading-relaxed font-sans">
              <strong>Ahmadiyya Muslim Jama&apos;at Nigeria</strong><br />
              KM 27, Abeokuta Expressway, Ojokoro, Lagos State, Nigeria.
            </p>
            <div className="pt-1 space-y-2.5 text-xs text-white/70">
              <div>
                <a
                  href="https://www.alislam.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lime font-semibold hover:underline flex items-center gap-1.5"
                >
                  <span>Al Islam Official (alislam.org)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
              <div>
                <a
                  href="https://jalsa.ahmadiyyanigeria.net/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-lime flex items-center gap-1.5"
                >
                  <span>Jalsa Nigeria Online Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
              <div className="pt-2 border-t border-white/10 text-[11px] text-white/50">
                Editorial Enquiries: <span className="text-lime/90">press@jalsasalana.ng</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Legal / Editorial Attribution */}
        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-[11px] text-white/40 gap-4">
          <div>
            &copy; {currentYear} Jalsa Salana Nigeria Digital Publication. All rights reserved. Under the auspices of Ahmadiyya Muslim Jama&apos;at Nigeria.
          </div>
          <div className="flex items-center space-x-6">
            <Link href="/editorial-policy" className="hover:text-lime transition-colors">
              Editorial Policy
            </Link>
            <Link href="/privacy-policy" className="hover:text-lime transition-colors">
              Privacy Policy
            </Link>
            <Link href="/contact" className="hover:text-lime transition-colors">
              Contact Desk
            </Link>
            <Link href="/login" className="hover:text-lime transition-colors font-semibold text-white/60">
              Staff Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
