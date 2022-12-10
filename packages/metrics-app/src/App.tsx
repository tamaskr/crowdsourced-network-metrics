import 'react-native-gesture-handler'
import { registerRootComponent } from 'expo'
import { StrictMode, Suspense, useEffect } from 'react'
import { RootSiblingParent } from 'react-native-root-siblings'
import { setBackgroundMessageListener, setForegroundMessageListener } from './services/messaging'
import { performMeasurementsFromQuery } from './services/measurements'
import Navigator from './navigation/Navigator'
import './utils/i18n'


function App() {

  // Set the FCM foreground listener
  useEffect(() => {
    return setForegroundMessageListener(performMeasurementsFromQuery)
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
setBackgroundMessageListener(performMeasurementsFromQuery)

// Register the root component
registerRootComponent(App)
