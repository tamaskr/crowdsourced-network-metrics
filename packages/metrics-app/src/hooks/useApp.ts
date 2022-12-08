import { useContext } from 'react'
import { AppContext } from '../providers/LanguageProvider'


export const useApp = () => useContext(AppContext)
