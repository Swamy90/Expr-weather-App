import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from '../src/locales/en.json'
import hi from "../src/locales/hi.json";

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: "v3",
    lng: "en",
    fallbackLng: "en",
    resources: {
      en: {
        translation: en
      },
      hi: {
        translation: hi
      }
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;