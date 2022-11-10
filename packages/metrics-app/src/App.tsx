import { registerRootComponent } from 'expo'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View, Alert } from 'react-native'
import messaging from '@react-native-firebase/messaging'
// eslint-disable-next-line @typescript-eslint/no-unused-vars, import/newline-after-import, import/default
import React, { useEffect } from 'react'

function App() {
  // eslint-disable-next-line unicorn/consistent-function-scoping, @typescript-eslint/no-explicit-any
  const requestUserPermission: any = async () => {
    const authStatus = await messaging().requestPermission()
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL

    if (enabled) {
      console.log('Authorization status:', authStatus)
    }
  }
  useEffect(() => {
    if (requestUserPermission()) {
      // return fcm token for the device
      messaging()
        .getToken()
        .then((token) => {
          console.log(token)
        })
    } else {
      console.log('Failed token status')
    }

    // check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(async (remoteMessage) => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification
          )
        }
      })

    // Assume a message-notification contains a "type" property in the data payload of the screen to open

    messaging().onNotificationOpenedApp(async (remoteMessage) => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification
      )
    })

    // Register background handler
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log('Message handled in the background!', remoteMessage)
    })

    // foregroundHandler
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage))
    })

    return unsubscribe
  }, [])

  return (
    <View style={styles.container}>
      <Text>Metrics app test FCM</Text>
      <StatusBar style='auto' />
    </View>
  )
}

const styles = StyleSheet.create({
  // eslint-disable-next-line react-native/no-color-literals
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})

registerRootComponent(App)
