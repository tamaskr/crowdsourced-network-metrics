import i18next  from 'i18next'
import { initReactI18next } from 'react-i18next'
import RNLanguageDetector from '@os-team/i18next-react-native-language-detector'
import en from './en.json'
import fi from './fi.json'

// Resources
const resources = {
  en: { translation: en },
  fi: { translation: fi }
} as const


i18next
  .use(RNLanguageDetector)
  .use(initReactI18next).init({
    fallbackLng: 'en',
    supportedLngs: [ 'en', 'fi' ],
    ns: [],
    defaultNS: undefined,
    resources,
    react: {
      useSuspense: false
    },
    interpolation: {
      escapeValue: false
    }
  })

export { default } from 'i18next'
