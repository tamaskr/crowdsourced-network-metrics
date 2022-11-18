import AsyncStorage from '@react-native-async-storage/async-storage'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'
import Tutorial from '../components/Tutorial'
import { checkLocationPermissions } from '../services/location'
import { performMeasurementsFromQuery } from '../services/measurements'
import { checkMessagingPermissions, enableMessaging, setForegroundMessageListener } from '../services/messaging'
import { colors } from '../theme/colors'


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.gray100,
    alignItems: 'center',
    justifyContent: 'center'
  }
})

function HomeScreen() {

  useEffect(() => {
    // Check location permissions
    checkLocationPermissions()
    // Enable messaging if permissions have been granted
    checkMessagingPermissions().then(granted => {
      if (granted) enableMessaging()
    })
    // Set the foreground message listener
    return setForegroundMessageListener(performMeasurementsFromQuery)
  }, [])


  return (
    <View style={styles.container}>
      <Tutorial />
      <Text>Metrics app test FCM</Text>
      <Button
        title={'clear storage'}
        onPress={() => {
          AsyncStorage.removeItem('tutorial')
        }}
      ></Button>
      <StatusBar style="auto" />
    </View>
  )
}

export default HomeScreen
