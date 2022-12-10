import { init, LanguageDetectorAsyncModule, use } from 'i18next'
import { initReactI18next } from 'react-i18next'
import { locale as deviceLanguage } from 'expo-localization'
import AsyncStorage from '@react-native-async-storage/async-storage'
import en from '../translation/en.json'
import fi from '../translation/fi.json'
import { logger } from './logger'


// Logger tag
const TAG = 'I18N'

// Use a language detector and cacher module utilizing AsyncStorage
use<LanguageDetectorAsyncModule>({
  async: true,
  type: 'languageDetector',
  init: () => null,
  detect: async (callback: (lng: string) => void) => {
    try {
      const cachedLanguage = await AsyncStorage.getItem('language')
      const lng = cachedLanguage ?? deviceLanguage
      logger.log(TAG, 'Detected user language', lng)
      callback(lng)
    } catch (error) {
      logger.error(TAG, 'Failed to detect user language', error)
    }
  },
  cacheUserLanguage: async (lng: string) => {
    try {
      await AsyncStorage.setItem('language', lng)
      logger.log(TAG, 'Cached user language', lng)
    } catch (error) {
      logger.error(TAG, 'Failed to cache user language', error)
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
