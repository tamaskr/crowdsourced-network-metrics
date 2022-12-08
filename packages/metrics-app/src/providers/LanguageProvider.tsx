import { createContext, useState, useEffect  } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useTranslation } from 'react-i18next'
import { IContext, AppProps } from '../types/types'
import { logger } from '../utils/logger'


export const AppContext = createContext<IContext>({} as IContext)

export const LanguageProvider = (props: AppProps) => {
  const { i18n } = useTranslation()
  const children = props.children
  const [ currentLanguage, setCurrentLanguage ] = useState('')

  const setLanguage = lang  => {
    setCurrentLanguage(lang)
    return true
  }
  const getLanguage = () => {
    return currentLanguage
  }

  const setLocalLang = async (lang: string) => {
    await AsyncStorage.setItem('language', lang)
  }

  useEffect(() => {
    if (!currentLanguage)  return
    i18n.changeLanguage(currentLanguage)
    setLocalLang(currentLanguage)
  }, [ i18n, currentLanguage ])

  // Check the chosen language when app launch
  useEffect(() => {
    AsyncStorage.getItem('language')
      .then(value => {
        if (value === null) {
          setCurrentLanguage('en')
          return
        }
        setCurrentLanguage(value)
      })
      .catch(error => logger.error('appProvider', 'Failed to check language', error))
  }, [])

  return (
    <AppContext.Provider value={{
      setLang: setLanguage,
      getLang: getLanguage
    }}>
      {children}
    </AppContext.Provider>
  )
}
