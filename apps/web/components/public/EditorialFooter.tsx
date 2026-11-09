import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function EditorialFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-950 text-white border-t border-primary-900 mt-auto">
      {/* Top Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Col 1: Brand & Jama'at Summary (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-12 h-12 flex-shrink-0">
                <Image
                  src="/images/jalsa-emblem.png"
                  alt="Jalsa Salana Official Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <span className="font-serif font-black text-lg tracking-wider text-white block">
                  JALSA SALANA
                </span>
                <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-gold block">
                  Nigeria — Digital Publication
                </span>
              </div>
            </Link>

            <p className="text-xs text-gray-300 leading-relaxed">
              Jalsa Salana Nigeria is the premier annual spiritual, educational, and intellectual gathering of the Ahmadiyya Muslim Jama&apos;at Nigeria, dedicated to peace, moral reformation, and divine guidance under the blessed institution of Khilafat-e-Ahmadiyya.
            </p>

            {/* Official 72nd Edition Logo Badge */}
            <div className="pt-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block mb-1.5">
                Upcoming Convention
              </span>
              <div className="inline-block bg-white px-3 py-1.5 rounded-lg shadow-sm">
                <div className="relative h-8 w-36 sm:w-40">
                  <Image
                    src="/images/jalsa72-logo.jpg"
                    alt="72nd Jalsa Salana Nigeria 2026 Official Logo"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>

            <div className="text-[11px] text-gray-400 border-l-2 border-gold pl-3 italic">
              &ldquo;Love for All, Hatred for None&rdquo; — Universal motto of the Ahmadiyya Muslim Community.
            </div>
          </div>

          {/* Col 2: Publication Sections (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-widest text-gold">
              Editorial Sections
            </h4>
            <ul className="space-y-2 text-xs text-gray-300">
              <li>
                <Link href="/registration" className="text-gold font-bold hover:underline flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold animate-ping"></span>
                  Registration &amp; Tags Hub 2026
                </Link>
              </li>
              <li>
                <Link href="/articles" className="hover:text-gold transition-colors">
                  Articles, Research &amp; Features
                </Link>
              </li>
              <li>
                <Link href="/speeches" className="hover:text-gold transition-colors">
                  Speeches &amp; Keynote Transcripts
                </Link>
              </li>
              <li>
                <Link href="/editions/2026" className="hover:text-gold transition-colors font-medium text-white flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-light"></span>
                  Jalsa Salana 2026 Edition Hub
                </Link>
              </li>
              <li>
                <Link href="/editions" className="hover:text-gold transition-colors">
                  Historical Conventions Timeline
                </Link>
              </li>
              <li>
                <Link href="/galleries" className="hover:text-gold transition-colors">
                  Photo &amp; Video Highlights
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-gold transition-colors">
                  Site-wide Archive Search
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Historical Editions (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-widest text-gold">
              Conventions
            </h4>
            <ul className="space-y-2 text-xs text-gray-300">
              <li>
                <Link href="/editions/2026" className="hover:text-gold transition-colors font-semibold">
                  2026 (72nd)
                </Link>
              </li>
              <li>
                <Link href="/editions/2025" className="hover:text-gold transition-colors">
                  2025 (71st)
                </Link>
              </li>
              <li>
                <Link href="/editions/2024" className="hover:text-gold transition-colors">
                  2024 (70th Jubilee)
                </Link>
              </li>
              <li>
                <Link href="/editions/2023" className="hover:text-gold transition-colors">
                  2023 (69th)
                </Link>
              </li>
              <li>
                <Link href="/editions/2022" className="hover:text-gold transition-colors">
                  2022 (68th)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Institutional & Legal (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-widest text-gold">
              Institution &amp; Contact
            </h4>
            <p className="text-xs text-gray-300 leading-relaxed">
              <strong>National Headquarters:</strong><br />
              Ahmadiyya Muslim Jama&apos;at Nigeria,<br />
              KM 27, Abeokuta Expressway, Ojokoro, Lagos State, Nigeria.
            </p>
            <div className="pt-1 space-y-1.5 text-xs text-gray-300">
              <div>
                <a
                  href="https://jalsa.ahmadiyyanigeria.net/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold font-semibold hover:underline flex items-center gap-1"
                >
                  <span>Portal: jalsa.ahmadiyyanigeria.net</span>
                  <span className="text-[10px]">↗</span>
                </a>
              </div>
              <div>
                <Link href="/about" className="hover:text-gold transition-colors">
                  About Jalsa Salana Nigeria
                </Link>
              </div>
              <div>
                <Link href="/editorial-policy" className="hover:text-gold transition-colors">
                  Editorial &amp; Archival Policy
                </Link>
              </div>
              <div>
                <Link href="/contact" className="hover:text-gold transition-colors">
                  Media &amp; Press Accreditation
                </Link>
              </div>
              <div>
                <Link href="/login" className="text-gold hover:underline">
                  Staff &amp; Editorial Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Sub-Footer Bar */}
      <div className="border-t border-primary-900 bg-black/30 py-4 text-xs text-gray-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            &copy; {currentYear} Jalsa Salana Nigeria. An official digital publishing organ of the Ahmadiyya Muslim Jama&apos;at Nigeria. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-gray-400">
            <Link href="/editorial-policy" className="hover:text-white transition-colors">
              Editorial Policy
            </Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-white transition-colors">
              Contact
            </Link>
            <span>•</span>
            <Link href="/login" className="text-gold-light hover:text-white transition-colors">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
