import { registerRootComponent } from 'expo'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View } from 'react-native'


const styles = StyleSheet.create({
  // eslint-disable-next-line react-native/no-color-literals
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
})

function App() {
  return (
    <View style={styles.container}>
      <Text>Metrics app</Text>
      <StatusBar style='auto' />
    </View>
  )
}

registerRootComponent(App)
