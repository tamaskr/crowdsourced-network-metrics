import { registerRootComponent } from 'expo'
import { useEffect } from 'react'
import { StyleSheet } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { RootSiblingParent } from 'react-native-root-siblings'
import { useTranslation } from 'react-i18next'
import { setBackgroundMessageListener, setForegroundMessageListener } from './services/messaging'
import { performMeasurementsFromQuery } from './services/measurements'
import HistoryScreen from './screens/HistoryScreen'
import HomeScreen from './screens/HomeScreen'
import { colors } from './theme/colors'
import './localization/i18n'


const styles = StyleSheet.create({
  navigator: {
    backgroundColor: colors.primary,
    height: 60,
    justifyContent: 'center'
  }
})

const Tab = createMaterialBottomTabNavigator()

function App() {
  const { t } = useTranslation()


  // Set the foreground message listener
  useEffect(() => {
    return setForegroundMessageListener(performMeasurementsFromQuery)
  }, [])
  return (
    <RootSiblingParent>
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="Feed"
          activeColor={colors.background.white}
          barStyle={styles.navigator}
        >
          <Tab.Screen
            name={t('bottomNav.home')}
            component={HomeScreen}
            options={{
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name="home-variant-outline" color={color} size={26} />
              )
            }}
          />
          <Tab.Screen
            name={t('bottomNav.history')}
            component={HistoryScreen}
            options={{
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name="history" color={color} size={26} />
              )
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </RootSiblingParent>
  )
}

// Set the background message listener
setBackgroundMessageListener(performMeasurementsFromQuery)

// Register the root component
registerRootComponent(App)
