import { StatusBar } from 'expo-status-bar'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native'
import Tutorial from '../components/Tutorial'
import { colors } from '../theme/colors'
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
  function ToastSubscribe() {
    ToastAndroid.show(
      'Opt in, start recieve FCM Messages and send reports!',
      ToastAndroid.LONG
    )
  }
  function ToastUnsubscribe() {
    ToastAndroid.show(
      'opt Out, no longer receive FCM messages and send reports!',
      ToastAndroid.LONG
    )
  }
  return (
    <View style={styles.container}>
      <Tutorial />
      <Text>You have opted in to metrics collection</Text>
      <TouchableOpacity
        onPress={() => {
          enableMessaging()
          ToastSubscribe()
        }}
      >
        <Text style={styles.Subscribebutton}> Subscribe to Topic</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          disableMessaging()
          ToastUnsubscribe()
        }}
      >
        <Text style={styles.unsubscribebutton}> Unsubscribe to Topic</Text>
      </TouchableOpacity>
      <StatusBar style='auto' />
    </View>
  )
}

export default HomeScreen
