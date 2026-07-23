import React, { createContext, useContext, useState, useCallback } from 'react';
import type { SupportedLang } from '../types';

interface LanguageContextType {
  lang: SupportedLang;
  setLang: (lang: SupportedLang) => void;
  t: (dict: Record<string, any>, key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<SupportedLang>('EN');

  const setLang = useCallback((newLang: SupportedLang) => {
    setLangState(newLang);
  }, []);

  const t = useCallback((dict: Record<string, any>, key: string): string => {
    if (!dict) return key;
    const langDict = dict[lang];
    if (!langDict) return key;
    return langDict[key] || key;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextType {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
}