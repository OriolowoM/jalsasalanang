'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage, LocaleCode } from '@/context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Sparkles, RefreshCw, AlertCircle, Check } from 'lucide-react';

interface TranslationRecord {
  locale: string;
  title: string;
  subtitle?: string | null;
  content: string;
  status?: string;
}

interface Props {
  articleId: string;
  initialTitle: string;
  initialSubtitle?: string;
  initialContent: string;
  initialTranslations?: TranslationRecord[];
}

const LANGUAGE_LABELS: Record<string, string> = {
  EN: 'English',
  YO: 'Èdè Yorùbá',
  HA: 'Harshen Hausa',
  IG: 'Asụsụ Igbo',
};

export default function LocalizedArticleContent({
  articleId,
  initialTitle,
  initialSubtitle,
  initialContent,
  initialTranslations = [],
}: Props) {
  const { locale, setLocale } = useLanguage();
  const [translations, setTranslations] = useState<Record<string, TranslationRecord>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Populate preloaded translations into a lookup map
  useEffect(() => {
    const map: Record<string, TranslationRecord> = {};
    for (const t of initialTranslations) {
      map[t.locale] = t;
    }
    setTranslations(map);
  }, [initialTranslations]);

  // Handle translation fetching or on-demand generation when locale changes
  useEffect(() => {
    if (locale === 'EN') return;

    if (translations[locale]) return; // Already present in state

    let isSubscribed = true;
    const fetchOrGenerate = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            articleId,
            title: initialTitle,
            excerpt: initialSubtitle || '',
            content: initialContent,
            locale,
          }),
        });

        const data = await res.json();
        if (data.success && data.data?.translation && isSubscribed) {
          setTranslations((prev) => ({
            ...prev,
            [locale]: {
              locale,
              title: data.data.translation.title,
              subtitle: data.data.translation.excerpt,
              content: data.data.translation.content,
              status: 'PENDING_REVIEW',
            },
          }));
        } else {
          throw new Error(data.message || 'Translation unavailable');
        }
      } catch (err: any) {
        if (isSubscribed) {
          setError(`Unable to generate ${LANGUAGE_LABELS[locale] || locale} translation.`);
        }
      } finally {
        if (isSubscribed) setLoading(false);
      }
    };

    fetchOrGenerate();
    return () => {
      isSubscribed = false;
    };
  }, [locale, articleId, initialTitle, initialSubtitle, initialContent, translations]);

  // Determine active displayed content
  const activeRecord = locale !== 'EN' ? translations[locale] : null;
  const displayTitle = activeRecord?.title || initialTitle;
  const displaySubtitle = activeRecord?.subtitle || initialSubtitle;
  const displayContent = activeRecord?.content || initialContent;

  return (
    <div>
      {/* ── Multilingual Translation Banner (Shown when non-English is active) ── */}
      {locale !== 'EN' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mb-8 p-4 rounded-2xl bg-teal-50 border border-teal-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
        >
          <div className="flex items-center gap-2.5 text-xs text-forest font-medium">
            <div className="w-8 h-8 rounded-xl bg-teal text-white flex items-center justify-center flex-shrink-0">
              <Globe className="w-4 h-4 text-lime" />
            </div>
            <div>
              <span className="font-bold text-teal">
                Viewing in {LANGUAGE_LABELS[locale] || locale}
              </span>
              <span className="block text-[11px] text-ink-muted">
                Officially localized via Jalsa Editorial AI • Preserves Islamic honorifics &amp; citations
              </span>
            </div>
          </div>

          <button
            onClick={() => setLocale('EN')}
            className="text-xs font-bold text-teal hover:text-forest underline self-start sm:self-auto"
          >
            Switch back to English
          </button>
        </motion.div>
      )}

      {/* ── Smooth Crossfading Content with Framer Motion AnimatePresence ── */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-16 text-center bg-white rounded-3xl border border-surface-border p-8"
          >
            <div className="w-12 h-12 rounded-2xl bg-teal/10 text-teal flex items-center justify-center mx-auto mb-4 animate-spin">
              <RefreshCw className="w-6 h-6" />
            </div>
            <h4 className="font-display font-bold text-base text-forest mb-1">
              Translating into {LANGUAGE_LABELS[locale] || locale}...
            </h4>
            <p className="text-xs text-ink-muted max-w-sm mx-auto">
              Our theological translation engine is localizing the text while ensuring Islamic terminology and quotes are accurately preserved.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key={locale}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            {/* Localized Article Title if translated */}
            {locale !== 'EN' && displayTitle !== initialTitle && (
              <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-forest mb-4 pb-3 border-b border-surface-border">
                {displayTitle}
              </h2>
            )}

            {/* Localized Subtitle if present */}
            {locale !== 'EN' && displaySubtitle && displaySubtitle !== initialSubtitle && (
              <p className="text-ink-muted text-base leading-relaxed mb-6 font-medium italic">
                {displaySubtitle}
              </p>
            )}

            {/* Rich Text Body */}
            <div className="editorial-prose-container text-size-md">
              <div
                className="prose prose-lg max-w-none text-ink-body font-sans leading-[1.88] editorial-drop-cap"
                dangerouslySetInnerHTML={{ __html: displayContent }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
