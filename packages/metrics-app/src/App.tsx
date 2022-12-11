import 'react-native-gesture-handler'
import { registerRootComponent } from 'expo'
import { StrictMode, Suspense, useEffect } from 'react'
import { LogBox } from 'react-native'
import * as SplashScreen from 'expo-splash-screen'
import { RootSiblingParent } from 'react-native-root-siblings'
import './services/i18n'
import { setBackgroundMessageListener, setForegroundMessageListener } from './services/messaging'
import { performMeasurement } from './services/measurement'
import Navigator from './navigation/Navigator'


// Ignore all logs to prevent popups in the app (logs remain visible in the console)
LogBox.ignoreAllLogs()

// Keep the splash screen visible until the navigator is ready
SplashScreen.preventAutoHideAsync()

function App() {

  // Set the FCM foreground listener
  useEffect(() => {
    return setForegroundMessageListener(performMeasurement)
  }, [])

  return (
    <StrictMode>
      <Suspense>
        <RootSiblingParent>
          <Navigator />
        </RootSiblingParent>
      </Suspense>
    </StrictMode>
  )
}

// Set the FCM background listener
setBackgroundMessageListener(performMeasurement)

// Register the root component
registerRootComponent(App)
