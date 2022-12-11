import { useState, useEffect, useCallback, Fragment } from 'react'
import { StatusBar } from 'expo-status-bar'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { requestPermissionsAsync as requestCellularPermissions } from 'expo-cellular'
import { requestLocationPermissions } from '../services/location'
import { enableMessaging, disableMessaging, requestMessagingPermissions, isMessagingEnabled } from '../services/messaging'
import { colors } from '../theme/colors'
import { toast } from '../utils/toast'


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

export default function HomeScreen() {
  const { t } = useTranslation()
  const [ isLoading, setIsLoading ] = useState(true)
  const [ isOptedIn, setIsOptedIn ] = useState(false)

  // Check for a previously saved opted-in state
  useEffect(() => {
    isMessagingEnabled().then(enabled => {
      setIsOptedIn(enabled)
      setIsLoading(false)
    })
  }, [])

  // Opt in by subscribing to the FCM topic and asking for permissions
  const optin = useCallback(async () => {
    const messagingGranted = await requestMessagingPermissions()
    const cellularGranted = await requestCellularPermissions()
    const locationGranted = await requestLocationPermissions()
    if (!messagingGranted || !cellularGranted || !locationGranted) {
      toast(t('homePage.infoToastPermission'))
      return
    }
    await enableMessaging()
    toast(t('homePage.infoToastIN'))
    setIsOptedIn(true)
  }, [ t ])

  // Opt out by unsubscribing from the FCM topic
  const optout = useCallback(async () => {
    await disableMessaging()
    toast(t('homePage.infoToastOUT'))
    setIsOptedIn(false)
  }, [ t ])

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" />
      ) : (
        <Fragment>
          <Text>{t('homePage.infoMsg')} {isOptedIn ? t('homePage.enabled') : t('homePage.disabled')}</Text>
          <TouchableOpacity onPress={() => isOptedIn ? optout() : optin()}>
            <Text style={styles.optinoutbutton}>
              {isOptedIn ? t('homePage.optOutBtn') : t('homePage.optInBtn')}
            </Text>
          </TouchableOpacity>
        </Fragment>
      )}
      <StatusBar style='auto' />
    </SafeAreaView>
  )
}
