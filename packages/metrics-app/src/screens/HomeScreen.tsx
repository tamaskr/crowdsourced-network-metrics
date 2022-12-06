import { useState, useEffect, useCallback } from 'react'
import { StatusBar } from 'expo-status-bar'
import { useTranslation } from 'react-i18next'
import SwitchSelector from 'react-native-switch-selector'
import {
  // eslint-disable-next-line react-native/split-platform-components
  ToastAndroid,
  StyleSheet, Text, View, TouchableOpacity
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { requestPermissionsAsync as checkCellularPermissions } from 'expo-cellular'
import { checkLocationPermissions } from '../services/location'
import { enableMessaging, disableMessaging, checkMessagingPermissions } from '../services/messaging'
import Tutorial from '../components/Tutorial'
import { colors } from '../theme/colors'
import { toast } from '../utils/toast'
import { logger } from '../utils/logger'


// Logger tag
const TAG = 'HomeScreen'

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
  },
  langSelector: {
    marginVertical: 20,
    paddingHorizontal: 80,
    alignItems: 'center'
  }
})

function HomeScreen() {
  const [ isOptedIn, setIsOptedIn ] = useState(false)
  const [ isLoading, setIsLoading ] = useState(true)
  const { t, i18n } = useTranslation()

  const options = [
    { label: 'English', value: 'en' },
    { label: 'Suomi', value: 'fi' }
  ]


  // Check for a previously saved opted-in state
  useEffect(() => {
    AsyncStorage.getItem('isUserOptedIn')
      .then(value => {
        if (value !== null) setIsOptedIn(value === 'true')
        setIsLoading(false)
      })
      .catch(error => logger.error(TAG, 'Failed to check for previous opted-in state', error))
  }, [])

  // user subscribe to get FCM messages and send reports
  function subscribe() {
    enableMessaging()
    ToastAndroid.show(
      t('homePage.infoToastIN'),
      ToastAndroid.SHORT
    )
    // save the user opt-in to AsyncStorage
    AsyncStorage.setItem('user', JSON.stringify(true))
  }
  // user unsubscribe and no longer to get FCM messages and send reports
  function unsubscribe() {
    disableMessaging()
    ToastAndroid.show(
      t('homePage.infoToastOUT'),
      ToastAndroid.SHORT
    )
    // save the user opt-out to AsyncStorage
    AsyncStorage.setItem('user', JSON.stringify(false))
  }
  // Opt in by subscribing to the FCM topic and asking for permissions
  const optin = useCallback(async () => {
    try {
      const messagingGranted = await checkMessagingPermissions()
      const cellularGranted = await checkCellularPermissions()
      const locationGranted = await checkLocationPermissions()
      if (!messagingGranted || !cellularGranted || !locationGranted) {
        toast('Permissions have not been granted.')
        return
      }
      await enableMessaging()
      toast('Opted in to metrics collection!')
      await AsyncStorage.setItem('isUserOptedIn', 'true')
      setIsOptedIn(true)
    } catch (error) {
      logger.error(TAG, 'Failed to opt in', error)
    }
  }, [])

  // Opt out by unsubscribing from the FCM topic
  const optout = useCallback(async () => {
    try {
      await disableMessaging()
      toast('Opted out from metrics collection!')
      await AsyncStorage.setItem('isUserOptedIn', 'false')
      setIsOptedIn(false)
    } catch (error) {
      logger.error(TAG, 'Failed to opt out', error)
    }
  }, [])

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
      <View style={styles.langSelector}>
        <SwitchSelector
          options={options}
          initial={0}
          selectedColor={colors.background.white}
          buttonColor={colors.primary}
          borderColor={colors.primary}
          hasPadding
          onPress={language => {
            i18n.changeLanguage(language)
          }}/>
      </View>
    </View>


  )
}

export default HomeScreen
