import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { I18nManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Language } from '../types';
import { ar } from '../i18n/ar';
import { en } from '../i18n/en';

type Translations = typeof ar;

interface LanguageContextType {
  language: Language;
  isRTL: boolean;
  translations: Translations;
  setLanguage: (lang: Language) => Promise<void>;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_KEY = '@clinic_dir_language';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ar');

  useEffect(() => {
    loadLanguage();
  }, []);

  const loadLanguage = async () => {
    try {
      const saved = await AsyncStorage.getItem(LANGUAGE_KEY);
      if (saved === 'ar' || saved === 'en') {
        applyLanguage(saved);
      }
    } catch (e) {
      // Use default
    }
  };

  const applyLanguage = (lang: Language) => {
    setLanguageState(lang);
    const isRTL = lang === 'ar';
    if (I18nManager.isRTL !== isRTL) {
      I18nManager.allowRTL(isRTL);
      I18nManager.forceRTL(isRTL);
    }
  };

  const setLanguage = async (lang: Language) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_KEY, lang);
      applyLanguage(lang);
    } catch (e) {
      applyLanguage(lang);
    }
  };

  const currentTranslations = language === 'ar' ? ar : en;

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = currentTranslations;
    for (const k of keys) {
      if (value === undefined || value === null) return key;
      value = value[k];
    }
    if (typeof value === 'string') return value;
    return key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        isRTL: language === 'ar',
        translations: currentTranslations,
        setLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
