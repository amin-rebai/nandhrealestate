import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import type { InitOptions } from 'i18next';

// Import translation files
import enTranslations from './locales/en.json';
import arTranslations from './locales/ar.json';
import frTranslations from './locales/fr.json';

const initOptions: InitOptions = {
  // Fallback language
  fallbackLng: 'en',

  // Debug mode
  debug: process.env.NODE_ENV === 'development',

  // Languages to support
  supportedLngs: ['en', 'ar', 'fr'],

  // Resources (translations)
  resources: {
    en: {
      translation: enTranslations
    },
    ar: {
      translation: arTranslations
    },
    fr: {
      translation: frTranslations
    }
  },

  // Language detection options
  detection: {
    // Order of language detection methods
    order: ['querystring', 'localStorage', 'navigator', 'htmlTag'],

    // Keys to lookup language from
    lookupQuerystring: 'lang',
    lookupLocalStorage: 'i18nextLng',

    // Cache user language
    caches: ['localStorage']
  },

  interpolation: {
    // React already does escaping
    escapeValue: false,
  },

  // Backend options for loading translations
  backend: {
    // Path where resources get loaded from
    loadPath: '/locales/{{lng}}.json',
  },

  // React options
  react: {
    // Use Suspense for loading translations
    useSuspense: true,
  }
};

i18n
  // Load translation using http -> see /public/locales (i.e. https://github.com/i18next/react-i18next/tree/master/example/react/public/locales)
  // Learn more: https://github.com/i18next/i18next-http-backend
  .use(Backend)
  // Detect user language
  // Learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  // For all options read: https://www.i18next.com/overview/configuration-options
  .init(initOptions);

// Handle RTL for Arabic — keep French LTR
i18n.on('languageChanged', (lng) => {
  const dir = lng === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.dir = dir;
  document.documentElement.lang = lng;
});

export default i18n;
