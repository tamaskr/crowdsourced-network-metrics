import { init, LanguageDetectorAsyncModule, use } from 'i18next'
import { initReactI18next } from 'react-i18next'
import { locale } from 'expo-localization'
import en from '../translation/en.json'
import fi from '../translation/fi.json'
import { logger } from './logger'


// Logger tag
const TAG = 'I18N'

// Use a language detector module that checks the device's current language
use<LanguageDetectorAsyncModule>({
  async: true,
  type: 'languageDetector',
  detect: async () => {
    try {
      const language = locale.startsWith('fi') ? 'fi' : 'en'
      logger.log(TAG, 'Detected user language', language)
      return language
    } catch (error) {
      logger.error(TAG, 'Failed to detect user language', error)
    }
  }
})

// Use the React compatibility module
use(initReactI18next)

// Set the language resources
const resources = {
  en: { translation: en },
  fi: { translation: fi }
}

// Initialize i18next
init({
  compatibilityJSON: 'v3',
  defaultNS: 'translation',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  },
  ns: [ 'translation' ],
  resources
})
