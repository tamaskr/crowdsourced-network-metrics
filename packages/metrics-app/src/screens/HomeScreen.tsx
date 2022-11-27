import { StatusBar } from 'expo-status-bar'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native'
import Tutorial from '../components/Tutorial'
import { enableMessaging, disableMessaging } from '../services/messaging'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  // eslint-disable-next-line react-native/no-color-literals
  Subscribebutton: {
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
    textAlignVertical: 'center',
  },
  // eslint-disable-next-line react-native/no-color-literals
  unsubscribebutton: {
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
    textAlignVertical: 'center',
  },
})

function HomeScreen() {
  function ToastOptIn() {
    ToastAndroid.show(
      'User start recieve FCM Messages and send reports!',
      ToastAndroid.SHORT
    )
  }
  function ToastOptOut() {
    ToastAndroid.show(
      'User no longer receive FCM messages and send reports!',
      ToastAndroid.SHORT
    )
  }
  return (
    <View style={styles.container}>
      <Tutorial />
      <Text>You have opted in to metrics collection</Text>
      <TouchableOpacity
        onPress={() => {
          enableMessaging()
          ToastOptIn()
        }}
      >
        <Text style={styles.Subscribebutton}> Opt-In</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          disableMessaging()
          ToastOptOut()
        }}
      >
        <Text style={styles.unsubscribebutton}> Opt-Out</Text>
      </TouchableOpacity>
      <StatusBar style='auto' />
    </View>
  )
}

export default HomeScreen
