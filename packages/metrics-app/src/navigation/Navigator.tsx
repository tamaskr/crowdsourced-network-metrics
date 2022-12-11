import { StyleSheet } from 'react-native'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useTranslation } from 'react-i18next'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect, useState } from 'react'
import HistoryScreen from '../screens/HistoryScreen'
import HomeScreen from '../screens/HomeScreen'
import { colors } from '../theme/colors'
import TutorialScreen from '../screens/TutorialScreen'
import { getUserHasSeenTutorial } from '../utils/tutorial'


const styles = StyleSheet.create({
  navigator: {
    backgroundColor: colors.primary,
    height: 60,
    justifyContent: 'center'
  }
})

// Set up stack navigation to determine if tutorial screen should be shown
const RootStack = createStackNavigator<RootStackParamList>()

// Set up tab navigator for main app flow
const MainTab = createMaterialBottomTabNavigator()

export type RootStackParamList = {
  Tutorial: undefined
  Main: undefined
}

export default function Navigator() {
  const { t } = useTranslation()
  const [ initialRoute, setInitialRoute ] = useState<keyof RootStackParamList | undefined>()

  // Check if the user has seen the tutorial, set the correct route and hide the splash screen
  useEffect(() => {
    getUserHasSeenTutorial().then(hasSeenTutorial => {
      setInitialRoute(hasSeenTutorial ? 'Main' : 'Tutorial')
      SplashScreen.hideAsync()
    })
  }, [])

  if (!initialRoute) return null
  return (
    <NavigationContainer>
      <RootStack.Navigator initialRouteName={initialRoute}>
        <RootStack.Screen name="Tutorial" component={TutorialScreen} options={{ headerShown: false, gestureEnabled: false }} />
        <RootStack.Screen name="Main" options={{ headerShown: false, gestureEnabled: false }}>
          {() => (
            <MainTab.Navigator
              initialRouteName="Home"
              activeColor={colors.background.white}
              barStyle={styles.navigator}
            >
              <MainTab.Screen
                name={t('bottomNav.home')}
                component={HomeScreen}
                options={{
                  tabBarIcon: ({ color }) => (
                    <MaterialCommunityIcons name="home-variant-outline" color={color} size={26} />
                  )
                }}
              />
              <MainTab.Screen
                name={t('bottomNav.history')}
                component={HistoryScreen}
                options={{
                  tabBarIcon: ({ color }) => (
                    <MaterialCommunityIcons name="history" color={color} size={26} />
                  )
                }}
              />
            </MainTab.Navigator>
          )}
        </RootStack.Screen>
      </RootStack.Navigator>
    </NavigationContainer>
  )
}
