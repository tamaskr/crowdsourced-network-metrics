import { useEffect } from 'react'
import { registerRootComponent } from 'expo'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View } from 'react-native'
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging'
import { measureDownloadBandwidth, measureLatency, measureSignalStrength } from './utils/measurements'
import { report } from './utils/report'


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export async function performMeasurements(message: FirebaseMessagingTypes.RemoteMessage): Promise<void> {
  console.log('Incoming query', message.data)
  // Check query id
  const queryId = message.data?.queryId
  if (!queryId) {
    console.warn('Query id is missing, skipping report.')
    return
  }
  // Take measurements
  const bandwidth = await measureDownloadBandwidth()
  const latency = await measureLatency()
  const signalStrength = await measureSignalStrength()
  // Report measurements
  const success = await report({
    queryId,
    bandwidth,
    latency,
    signalStrength,
    coordinates: {
      latitude: 60.2,
      longitude: 24.4
    }
  })
  console.log('Is reporting successful', success)
}

function App() {

  async function requestFCMPermission() {
    try {
      const authStatus = await messaging().requestPermission()
      const { AuthorizationStatus } = messaging
      if ([ AuthorizationStatus.AUTHORIZED, AuthorizationStatus.PROVISIONAL ].includes(authStatus)) {
        await messaging().subscribeToTopic('CMNM_QUERY')
        console.log('Messaging permission granted')
      } else {
        console.warn('Messaging permission NOT granted')
      }
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    requestFCMPermission()

    // Register foreground message handler
    return messaging().onMessage(performMeasurements)
  }, [])

  return (
    <View style={styles.container}>
      <Text>Metrics app test FCM</Text>
      <StatusBar style='auto' />
    </View>
  )
}

// Register background message handler
messaging().setBackgroundMessageHandler(performMeasurements)

registerRootComponent(App)
