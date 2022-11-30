
import { useState, useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  // eslint-disable-next-line react-native/split-platform-components
  ToastAndroid
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Tutorial from '../components/Tutorial'
import { enableMessaging, disableMessaging } from '../services/messaging'


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10
  },
  // eslint-disable-next-line react-native/no-color-literals
  optinoutbutton: {
    marginVertical: 10,
    height: 40,
    marginHorizontal: 10,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    borderWidth: 2,
    borderColor: '#5d57ff',
    textAlign: 'center',
    textAlignVertical: 'center'
  }
})

function HomeScreen() {
  const [ optIn, setOptIn ] = useState(false)

  useEffect(() => {
    AsyncStorage.clear()
  })

  function subscribe() {
    enableMessaging()
    ToastAndroid.show(
      'User starts recieve FCM Messages and send reports!',
      ToastAndroid.SHORT
    )
    AsyncStorage.setItem('user', 'opted in')
    setOptIn(true)
  }
  function unsubscribe() {
    disableMessaging()
    ToastAndroid.show(
      'User no longer receive FCM messages and send reports!',
      ToastAndroid.SHORT
    )
    AsyncStorage.setItem('user', 'opted out')
    setOptIn(false)
  }
  return (
    <View style={styles.container}>
      <Tutorial />
      <Text>You have opted in to metrics collection</Text>
      <TouchableOpacity
        onPress={() => {
          optIn ? unsubscribe() : subscribe()
          setOptIn(!optIn)
        }}
      >
        <Text style={styles.optinoutbutton}>
          {optIn ? 'opt-out' : 'opt-in'}
        </Text>
      </TouchableOpacity>
      <StatusBar style='auto' />
    </View>
  )
}

export default HomeScreen
