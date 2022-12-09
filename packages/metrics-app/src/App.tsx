import 'react-native-gesture-handler'
import { registerRootComponent } from 'expo'
import { useEffect } from 'react'
import { RootSiblingParent } from 'react-native-root-siblings'
import {
  setBackgroundMessageListener,
  setForegroundMessageListener
} from './services/messaging'
import { performMeasurementsFromQuery } from './services/measurements'
import './utils/i18n'
import { LanguageProvider } from './providers/LanguageProvider'
import Navigator from './navigation/Navigator'


function App() {
  // Set the foreground message listener
  useEffect(() => {
    return setForegroundMessageListener(performMeasurementsFromQuery)
  }, [])

  return (
    <RootSiblingParent>
      <LanguageProvider>
        <Navigator />
      </LanguageProvider>
    </RootSiblingParent>
  )
}

// Set the background message listener
setBackgroundMessageListener(performMeasurementsFromQuery)

// Register the root component
registerRootComponent(App)
