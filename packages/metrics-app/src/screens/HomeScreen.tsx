import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View } from 'react-native'
import Tutorial from '../components/Tutorial'
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
  return (
    <View style={styles.container}>
      <Tutorial />
      <Text>You have opted in to metrics collection</Text>
      <StatusBar style="auto" />
    </View>
  )
}

export default HomeScreen
