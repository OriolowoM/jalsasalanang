'use client';

import React, { useState } from 'react';
import { Copy, Check, MessageSquare } from 'lucide-react';

export default function SocialShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const getUrl = () => {
    if (typeof window !== 'undefined') return window.location.href;
    return 'https://jalsasalana.ng';
  };

  const handleCopy = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(getUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareToTwitter = () => {
    const text = encodeURIComponent(`${title} — Read on Jalsa Salana Nigeria:\n`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(getUrl())}`, '_blank');
  };

  const shareToWhatsApp = () => {
    const text = encodeURIComponent(`*${title}*\nRead on Jalsa Salana Nigeria:\n${getUrl()}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getUrl())}`, '_blank');
  };

  const shareToLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getUrl())}`, '_blank');
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={shareToWhatsApp}
        className="px-3 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
        title="Share on WhatsApp"
      >
        <MessageSquare className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">WhatsApp</span>
      </button>

      <button
        type="button"
        onClick={shareToTwitter}
        className="px-3 py-1.5 rounded-lg bg-black hover:bg-gray-800 text-white text-xs font-bold transition-colors shadow-sm"
        title="Share on X"
      >
        X (Twitter)
      </button>

      <button
        type="button"
        onClick={shareToFacebook}
        className="px-3 py-1.5 rounded-lg bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs font-bold transition-colors shadow-sm"
        title="Share on Facebook"
      >
        Facebook
      </button>

      <button
        type="button"
        onClick={shareToLinkedIn}
        className="px-3 py-1.5 rounded-lg bg-[#0A66C2] hover:bg-[#095196] text-white text-xs font-bold transition-colors shadow-sm"
        title="Share on LinkedIn"
      >
        LinkedIn
      </button>

      <button
        type="button"
        onClick={handleCopy}
        className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-charcoal text-xs font-semibold flex items-center gap-1 transition-colors"
        title="Copy Link"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-primary" />
            <span className="text-primary font-bold">Copied!</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5 text-gray-500" />
            <span>Copy Link</span>
          </>
        )}
      </button>
    </div>
  );
}
