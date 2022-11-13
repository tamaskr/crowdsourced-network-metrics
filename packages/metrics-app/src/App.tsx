import { useCallback, useEffect, useState } from 'react'
import { registerRootComponent } from 'expo'
import { StatusBar } from 'expo-status-bar'
import { Button, StyleSheet, Text, View } from 'react-native'
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

async function handleRemoteMessage(message: FirebaseMessagingTypes.RemoteMessage): Promise<void> {
  console.log('Perform measurements', JSON.stringify(message))
  // Check query id
  const queryId = message.data?.queryId
  if (!queryId) {
    console.warn('Query id is missing, skipping report.')
    return
  }
  const bandwidth = await measureDownloadBandwidth()
  const latency = await measureLatency()
  const signalStrength = await measureSignalStrength()
  await report({
    queryId,
    bandwidth,
    latency,
    signalStrength,
    coordinates: {
      latitude: 0,
      longitude: 0
    }
  })
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
    return messaging().onMessage(handleRemoteMessage)
  }, [])

  const [ isMeasuringBandwidth, setIsMeasuringBandwidth ] = useState(false)

  const bandwidth = useCallback(async () => {
    if (isMeasuringBandwidth) return
    setIsMeasuringBandwidth(true)
    const kbps = await measureDownloadBandwidth()
    console.log(`Bandwidth is ${kbps} kbps`)
    setIsMeasuringBandwidth(false)
  }, [ isMeasuringBandwidth ])

  return (
    <View style={styles.container}>
      <Text>Metrics app test FCM</Text>
      <Button title="Measure bandwidth" onPress={bandwidth} disabled={isMeasuringBandwidth} />
      <StatusBar style='auto' />
    </View>
  )
}

// Register background message handler
messaging().setBackgroundMessageHandler(handleRemoteMessage)

registerRootComponent(App)
