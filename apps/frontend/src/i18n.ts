import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { en } from './locales/en';
import { fr } from './locales/fr';

const browserLanguage = typeof navigator === 'undefined' ? 'en' : navigator.language;

void i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    fr: { translation: fr }
  },
  lng: browserLanguage,
  fallbackLng: 'en',
  supportedLngs: ['en', 'fr'],
  nonExplicitSupportedLngs: true,
  showSupportNotice: false,
  interpolation: {
    escapeValue: false
  },
  initImmediate: false
});

export default i18n;
