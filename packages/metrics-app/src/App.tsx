import 'react-native-gesture-handler'
import { registerRootComponent } from 'expo'
import { StrictMode, Suspense, useEffect } from 'react'
import * as SplashScreen from 'expo-splash-screen'
import { RootSiblingParent } from 'react-native-root-siblings'
import { setBackgroundMessageListener, setForegroundMessageListener } from './services/messaging'
import { performMeasurement } from './services/measurements'
import Navigator from './navigation/Navigator'
import './utils/i18n'


// Prevent app loading until the stack navigator is ready
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
