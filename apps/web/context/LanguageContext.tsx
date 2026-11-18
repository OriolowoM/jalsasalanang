'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type LocaleCode = 'EN' | 'YO' | 'HA' | 'IG';

interface LanguageContextType {
  locale: LocaleCode;
  setLocale: (l: LocaleCode) => void;
  localeName: string;
}

const LOCALE_NAMES: Record<LocaleCode, string> = {
  EN: 'English',
  YO: 'Èdè Yorùbá',
  HA: 'Harshen Hausa',
  IG: 'Asụsụ Igbo',
};

const LanguageContext = createContext<LanguageContextType>({
  locale: 'EN',
  setLocale: () => {},
  localeName: 'English',
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<LocaleCode>('EN');

  useEffect(() => {
    const saved = localStorage.getItem('jalsa_preferred_locale') as LocaleCode;
    if (saved && LOCALE_NAMES[saved]) {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = (l: LocaleCode) => {
    setLocaleState(l);
    if (typeof window !== 'undefined') {
      localStorage.setItem('jalsa_preferred_locale', l);
    }
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, localeName: LOCALE_NAMES[locale] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
