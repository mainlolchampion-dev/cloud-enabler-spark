import { useState, useEffect } from 'react';

export type Locale = 'el' | 'en';

export function useLocale() {
  const [locale, setLocale] = useState<Locale>('el');

  useEffect(() => {
    // Get locale from localStorage or browser language
    const savedLocale = localStorage.getItem('locale') as Locale;
    if (savedLocale) {
      setLocale(savedLocale);
    } else {
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('el')) {
        setLocale('el');
      } else {
        setLocale('en');
      }
    }
  }, []);

  const changeLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  return { locale, changeLocale };
}
