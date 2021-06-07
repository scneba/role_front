//https://github.com/i18next/react-i18next/blob/master/example/react/src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import * as shared from "./sharedTranslations";
import * as nav from "./components/nav/translations";
import * as login from "./components/login/translations";
import * as admin from "./components/admin/translations";
import * as errors from "./components/generics/errortranslations";
// don't want to use this?
// have a look at the Quick start guide
// for passing in lng and translations on init

i18n
  // load translation using http -> see /public/locales (i.e. https://github.com/i18next/react-i18next/tree/master/example/react/public/locales)
  // learn more: https://github.com/i18next/i18next-http-backend
  .use(Backend)
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    react: {
      useSuspense: false, //   <---- this will do the magic
    },
    resources: {
      en: {
        shared: shared.en,
        nav: nav.en,
        login: login.en,
        admin: admin.en,
        errors: errors.en,
      },
      fr: {
        translation: {
          shared: shared.fr,
        },
      },
      swa: {
        translation: {
          shared: shared.swa,
        },
      },
    },
    fallbackLng: "en",
    defaultNS: "shared",
    debug: process.env.NODE_ENV === "development",

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
