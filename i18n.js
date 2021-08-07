import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    debug: true,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
      en: {
        translation: {
          home: {
            craftsman: {
              fixes: {
                notavailable: 'No fixes available..',
              },
            },
          },
        },
      },
      fr: {
        translation: {
          home: {
            craftsman: {
              fixes: {
                notavailable: 'Aucune réparation disponible..',
              },
            },
          },
        },
      },
    },
  });

export default i18n;
