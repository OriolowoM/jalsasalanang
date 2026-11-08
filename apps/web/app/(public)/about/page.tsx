import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'About Jalsa Salana Nigeria',
  description: 'Learn about the history, spiritual mission, and institutional objectives of Jalsa Salana Nigeria.',
};

export default function AboutPage() {
  return (
    <div className="py-8 sm:py-12 bg-surface-bg min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="pb-6 mb-8 border-b-2 border-primary">
          <span className="text-xs font-extrabold uppercase tracking-widest text-gold-dark block mb-1">
            Institutional Profile
          </span>
          <h1 className="font-serif font-black text-3xl sm:text-5xl text-charcoal-heading">
            About Jalsa Salana Nigeria
          </h1>
        </div>

        {/* Hero image */}
        <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-gray-100 mb-8 shadow-sm">
          <Image
            src="/images/70th-jalsa-hero.jpg"
            alt="Jalsa Salana Nigeria Assembly"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none text-charcoal font-serif text-[18px] leading-[1.85] bg-white p-6 sm:p-10 rounded-2xl border border-gray-200 shadow-sm">
          <h2>The Divine Purpose of Jalsa Salana</h2>
          <p>
            Jalsa Salana (Annual Convention) is not merely a conference or festival; it is a sacred institution founded in 1891 in Qadian, India, by <strong>Hazrat Mirza Ghulam Ahmad (as)</strong>, the Promised Messiah and Mahdi, under divine inspiration.
          </p>

          <blockquote>
            &ldquo;The primary purpose of this Convention is that every sincere member of the Community should derive spiritual benefits; they may enhance their religious knowledge and that their mutual acquaintance may increase and that affection between them may be established.&rdquo; — The Promised Messiah (as)
          </blockquote>

          <h2>History in Nigeria</h2>
          <p>
            The Ahmadiyya Muslim Community was formally introduced to Nigeria in 1916. Since the inaugural conventions held in Lagos during the early twentieth century, Jalsa Salana Nigeria has expanded into the largest annual spiritual gathering of Muslims in West Africa, regularly convening over 40,000 delegates from across the nation and the diaspora.
          </p>

          <h2>Under the Guidance of Khilafat</h2>
          <p>
            Today, Jalsa Salana Nigeria functions under the direct spiritual direction and continuous guidance of <strong>Hazrat Mirza Masroor Ahmad (aba)</strong>, the Fifth Successor to the Promised Messiah and worldwide Head of the Ahmadiyya Muslim Community.
          </p>
          <p>
            Through special messages, live telecasts on MTA International, and prayers, the convention continues to be a sanctuary of peace, moral uprightness, and service to humanity.
          </p>
        </div>
      </div>
    </div>
  );
}
