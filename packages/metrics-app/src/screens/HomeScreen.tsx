import { useState, useEffect } from 'react'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import Toast from 'react-native-root-toast'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Tutorial from '../components/Tutorial'
import { enableMessaging, disableMessaging } from '../services/messaging'
import { colors } from '../theme/colors'


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10
  },
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
    borderColor: colors.primary,
    textAlign: 'center',
    textAlignVertical: 'center'
  }
})

function HomeScreen() {
  const [ isOptedIn, setIsOptedIn ] = useState(false)
  const [ isLoading, setIsLoading ] = useState(true)

  // Check on app launch if the user has opted in or out before
  useEffect(() => {
    AsyncStorage.getItem('isUserOptedIn').then(value => {
      if (value !== null) setIsOptedIn(value === 'true')
      setIsLoading(false)
    })
  }, [])

  // user subscribe to get FCM messages and send reports
  function optin() {
    enableMessaging()
    Toast.show('Opted in to metrics collection!', {
      duration: Toast.durations.SHORT,
      position: 120,
      animation: true,
      backgroundColor: colors.primary
    })
    // save the user opt-in to AsyncStorage
    AsyncStorage.setItem('isUserOptedIn', JSON.stringify(true))
    setIsOptedIn(true)
  }

  // user unsubscribe and no longer to get FCM messages and send reports
  function optout() {
    disableMessaging()
    Toast.show('Opted out from metrics collection!', {
      duration: Toast.durations.SHORT,
      position: 120,
      animation: true,
      backgroundColor: colors.primary
    })
    // save the user opt-out to AsyncStorage
    AsyncStorage.setItem('isUserOptedIn', JSON.stringify(false))
    setIsOptedIn(false)
  }

  if (isLoading) return null
  return (
    <View style={styles.container}>
      <Tutorial />
      <Text>Metrics collection {isOptedIn ? 'enabled' : 'disabled'}</Text>
      <TouchableOpacity onPress={isOptedIn ? optout : optin}>
        <Text style={styles.optinoutbutton}>
          {isOptedIn ? 'Opt out' : 'Opt in'}
        </Text>
      </TouchableOpacity>
      <StatusBar style='auto' />
    </View>
  )
}

export default HomeScreen
