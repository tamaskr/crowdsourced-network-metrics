import { useCallback, useEffect, useState } from 'react'
import { registerRootComponent } from 'expo'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View, Alert, Button } from 'react-native'
import messaging from '@react-native-firebase/messaging'
import { measureDownloadBandwidth } from './bandwidth'


function App() {
  // eslint-disable-next-line unicorn/consistent-function-scoping
  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission()
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL

    if (enabled) {
      console.log('Authorization status:', authStatus)
      return true
    }
    return false
  }

  const Token = async () => {
    if (await requestUserPermission()) {
      // return fcm token for the device
      messaging()
        .getToken()
        .then(token => {
          console.log(token)
        })
    } else {
      console.log('Failed token status')
    }
  }

  useEffect(() => {
    Token()

    // check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(async remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification
          )
        }
      })

    // Assume a message-notification contains a "type" property in the data payload of the screen to open

    messaging().onNotificationOpenedApp(async remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification
      )
    })

    // Register background handler
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage)
    })

    // foregroundHandler
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage))
    })

    return unsubscribe
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
})

registerRootComponent(App)
