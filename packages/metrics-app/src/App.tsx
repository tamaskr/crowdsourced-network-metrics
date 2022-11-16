import { useEffect, useState } from 'react'
import { registerRootComponent } from 'expo'
import { StatusBar } from 'expo-status-bar'
import { Button, Modal, ScrollView, StyleSheet, Text, View } from 'react-native'
import * as React from 'react'
import {
  checkMessagingPermissions,
  enableMessaging,
  setBackgroundMessageListener,
  setForegroundMessageListener
} from './services/messaging'
import { performMeasurementsFromQuery } from './services/measurements'
import { checkLocationPermissions } from './services/location'
import { text } from './utils/tutorialText'


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignSelf: 'center'

  },
  modalView: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 20,
    margin: 20,
    padding: 20,
    alignItems: 'center',
    borderColor: 'black'
  },
  modalTitle: {
    marginBottom: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 18
  }

})

function App() {

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

  const [ isShowed, setIsShowed ] = useState(true)

  return (
    <View style={styles.container}>
      <View>
        <Modal
          animationType={'slide'}
          transparent={true}
          visible={isShowed}
        >
          <ScrollView>
            <View style={styles.modalContainer}>
              <View style={styles.modalView}>
                <Text style={styles.modalTitle}>ATTENTION</Text>
                <Text>{text}</Text>
                <Button
                  title={'Continue'}
                  onPress={() => setIsShowed(false)}
                ></Button>
              </View>
            </View>
          </ScrollView>
        </Modal>
      </View>
      <Text>Metrics app test FCM</Text>
      <StatusBar style="auto" />
    </View>
  )
}

// Set the background message listener
setBackgroundMessageListener(performMeasurementsFromQuery)

// Register the root component
registerRootComponent(App)
