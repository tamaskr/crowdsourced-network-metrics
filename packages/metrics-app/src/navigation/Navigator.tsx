import { StyleSheet } from 'react-native'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useTranslation } from 'react-i18next'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import HistoryScreen from '../screens/HistoryScreen'
import HomeScreen from '../screens/HomeScreen'
import { colors } from '../theme/colors'
import TutorialScreen from '../screens/TutorialScreen'


const styles = StyleSheet.create({
  navigator: {
    backgroundColor: colors.primary,
    height: 60,
    justifyContent: 'center'
  }
})

// Set up tab navigator for main app flow
const Tab = createMaterialBottomTabNavigator()

// Set up stack navigation to determine if tutorial screen should be shown
const Stack = createStackNavigator<RootStackParamList>()

// Prevent app loading until the stack navigator is ready
SplashScreen.preventAutoHideAsync()

const MainStack = () => {
  const { t } = useTranslation()
  return (
    <Tab.Navigator
      initialRouteName="Home"
      activeColor={colors.background.white}
      barStyle={styles.navigator}
    >
      <Tab.Screen
        name={t('bottomNav.home')}
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="home-variant-outline"
              color={color}
              size={26}
            />
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
  )
}

const Navigator = () => {
  const [ initialRoute, setInitialRoute ] = useState<
    keyof RootStackParamList | undefined
  >()

  useEffect(() => {
    const checkTutorialToken = async () => {
      try {
        const token = await AsyncStorage.getItem('hasShownTutorial')
        if (token === null) return setInitialRoute('Tutorial')
        setInitialRoute('Main')
      } catch {
        setInitialRoute('Main')
      }
    }
    checkTutorialToken()
    SplashScreen.hideAsync()
  }, [])

  if (!initialRoute) return null

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen
          name="Main"
          component={MainStack}
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen
          name="Tutorial"
          component={TutorialScreen}
          options={{ headerShown: false, gestureEnabled: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default Navigator

export type RootStackParamList = {
  Tutorial: undefined
  Main: undefined
}
