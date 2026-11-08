import React from 'react';

export const metadata = {
  title: 'Editorial Policy & Verification Standards',
  description: 'Our commitment to journalistic integrity, historical accuracy, theological verification, and copyright attribution.',
};

export default function EditorialPolicyPage() {
  return (
    <div className="py-8 sm:py-12 bg-surface-bg min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pb-6 mb-8 border-b-2 border-primary">
          <span className="text-xs font-extrabold uppercase tracking-widest text-gold-dark block mb-1">
            Governance &amp; Integrity
          </span>
          <h1 className="font-serif font-black text-3xl sm:text-5xl text-charcoal">
            Editorial Policy &amp; Standards
          </h1>
        </div>

        <div className="prose prose-lg max-w-none text-charcoal font-serif text-[18px] leading-[1.85] bg-white p-6 sm:p-10 rounded-2xl border border-gray-200 shadow-sm">
          <h2>1. Theological &amp; Scriptural Fidelity</h2>
          <p>
            All theological commentary, Quranic translations, and Hadith references published on this platform undergo review by qualified theologians and scholars of the Ahmadiyya Muslim Jama&apos;at Nigeria to ensure adherence to classical orthodoxy and the commentary of the Promised Messiah (as).
          </p>

          <h2>2. Accuracy &amp; Attribution of Historical Records</h2>
          <p>
            Historical convention archives, delegate attendance statistics, and transcripts of speeches delivered by Khalifatul Masih or the National Amir are cross-referenced with official minutes, audio recordings, and publications of the Central Tarbiyya and Isha&apos;at departments.
          </p>

          <h2>3. Photography &amp; Copyright Attribution</h2>
          <p>
            All media photographs published on this platform are property of the Jalsa Salana Nigeria Photojournalism Unit, Makhzan-e-Tasaweer, or licensed media partners. Photographer attribution is strictly maintained on all assets.
          </p>

          <h2>4. Corrections &amp; Revisions</h2>
          <p>
            The editorial board promptly corrects substantive errors of fact. Revisions are tracked within our administrative audit log system. Readers and journalists may submit factual inquiries to <code className="text-primary font-mono text-sm">editor@jalsasalana.ng</code>.
          </p>
        </div>
      </div>
    </div>
  );
}
