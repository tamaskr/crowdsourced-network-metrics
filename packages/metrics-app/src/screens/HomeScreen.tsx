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
  const [ isOptIn, setIsOptIn ] = useState(false)
  const [ isLoading, setIsLoading ] = useState(true)

  useEffect(() => {
    async function fetchOpt() {
      await AsyncStorage.getItem('user').then(value => {
        console.log('value of opted:', value)
        if (value === null || value === JSON.stringify(true)) {
          setIsOptIn(true)
        }
        setIsOptIn(value === JSON.stringify(true))
        setIsLoading(false)
      })
    }
    fetchOpt()
  }, [])

  // user subscribe to get FCM messages and send reports
  function subscribe() {
    enableMessaging()
    ToastAndroid.show(
      'User starts recieve FCM Messages and send reports!',
      ToastAndroid.SHORT
    )
    // save the user opt-in to AsyncStorage
    AsyncStorage.setItem('user', JSON.stringify(true))
  }
  // user unsubscribe and no longer to get FCM messages and send reports
  function unsubscribe() {
    disableMessaging()
    ToastAndroid.show(
      'User no longer receive FCM messages and send reports!',
      ToastAndroid.SHORT
    )
    // save the user opt-out to AsyncStorage
    AsyncStorage.setItem('user', JSON.stringify(false))
  }

  if (isLoading) return null
  return (
    <View style={styles.container}>
      <Tutorial />
      <Text>You have opted in to metrics collection</Text>
      <TouchableOpacity
        onPress={() => {
          isOptIn ? unsubscribe() : subscribe()
          setIsOptIn(!isOptIn)
        }}
      >
        <Text style={styles.optinoutbutton}>
          {isOptIn ? 'opt-out' : 'opt-in'}
        </Text>
      </TouchableOpacity>
      <StatusBar style='auto' />
    </View>
  )
}

export default HomeScreen
