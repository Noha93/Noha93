import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { readJSON, writeJSON } from '../utils/storage';
import { translate, type Locale } from '../i18n/strings';

export type { Locale } from '../i18n/strings';
export type Dir = 'rtl' | 'ltr';

const LOCALE_KEY = 'tawari:locale';

interface LocaleContextValue {
  locale: Locale;
  dir: Dir;
  setLocale: (locale: Locale) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('ar');

  useEffect(() => {
    readJSON<Locale>(LOCALE_KEY, 'ar').then(setLocaleState);
  }, []);

  const setLocale = (next: Locale) => {
    setLocaleState(next);
    writeJSON(LOCALE_KEY, next);
  };

  const dir: Dir = locale === 'ar' ? 'rtl' : 'ltr';
  const t = (key: string, vars?: Record<string, string | number>) => translate(locale, key, vars);

  const value = useMemo(() => ({ locale, dir, setLocale, t }), [locale, dir]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider');
  return ctx;
}

// Direction-aware layout helpers — the app never uses I18nManager.forceRTL
// (that requires an app reload to take effect), so every row layout and text
// alignment mirrors manually based on the active locale's `dir`.
export function rowDir(dir: Dir): 'row-reverse' | 'row' {
  return dir === 'rtl' ? 'row-reverse' : 'row';
}

export function textAlignDir(dir: Dir): 'right' | 'left' {
  return dir === 'rtl' ? 'right' : 'left';
}
