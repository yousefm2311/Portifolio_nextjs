'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { translations, Locale, TranslationKey } from '@/data/translations';

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
};

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

export function LocaleProvider({
  initialLocale,
  children
}: {
  initialLocale: Locale;
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale ?? 'ar');

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    document.cookie = `lang=${locale}; path=/; max-age=31536000`;
  }, [locale]);

  const value = useMemo(() => {
    const t = (key: TranslationKey) => translations[locale][key] ?? key;
    return { locale, setLocale: setLocaleState, t };
  }, [locale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error('useLocale must be used within LocaleProvider');
  }
  return ctx;
}
