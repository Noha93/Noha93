/**
 * i18n Index - Translation utility
 */

import { ar } from './ar';
import { en } from './en';
import { Language } from '../types';

type TranslationKeys = typeof ar;

export const translations: Record<Language, TranslationKeys> = { ar, en };

export function t(language: Language, key: string): string {
  const keys = key.split('.');
  let value: any = translations[language];
  for (const k of keys) {
    if (value === undefined || value === null) return key;
    value = value[k];
  }
  if (typeof value === 'string') return value;
  return key;
}

export function useTranslation(language: Language) {
  return {
    t: (key: string) => t(language, key),
    locale: language,
    isRTL: language === 'ar',
  };
}

export { ar, en };
export type { TranslationKeys };
