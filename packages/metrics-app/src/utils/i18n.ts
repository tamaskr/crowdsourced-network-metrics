import i18next  from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from '../translation/en.json'
import fi from '../translation/fi.json'


// Resources
export const resources = {
  en: { translation: en },
  fi: { translation: fi }
} as const


i18next.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  lng: 'en',
  resources,
  react: {
    useSuspense: false
  }
})

export { default } from 'i18next'
