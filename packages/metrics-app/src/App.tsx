import { useEffect } from 'react'
import { registerRootComponent } from 'expo'
import { StatusBar } from 'expo-status-bar'
import { Button, StyleSheet, Text, View } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  checkMessagingPermissions,
  enableMessaging,
  setBackgroundMessageListener,
  setForegroundMessageListener,
} from './services/messaging'
import { performMeasurementsFromQuery } from './services/measurements'
import { checkLocationPermissions } from './services/location'
import Tutorial from './components/Tutorial'
// eslint-disable-next-line import/newline-after-import
import { getCurrentCoordinates } from './services/devicelocation'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

function App() {
  useEffect(() => {
    // Check location permissions
    checkLocationPermissions()
    // device location coordinates
    getCurrentCoordinates()
    // Enable messaging if permissions have been granted
    checkMessagingPermissions().then((granted) => {
      if (granted) enableMessaging()
    })
    // Set the foreground message listener
    return setForegroundMessageListener(performMeasurementsFromQuery)
  }, [])

  return (
    <View style={styles.container}>
      <Tutorial></Tutorial>
      <Text>Metrics app test FCM</Text>
      <Button
        title={'clear storage'}
        onPress={() => {
          AsyncStorage.removeItem('tutorial')
        }}
      ></Button>
      <StatusBar style='auto' />
    </View>
  )
}

// Set the background message listener
setBackgroundMessageListener(performMeasurementsFromQuery)

// Register the root component
registerRootComponent(App)
