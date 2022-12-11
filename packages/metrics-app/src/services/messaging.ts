import messaging from '@react-native-firebase/messaging'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { FCMDataMessage } from '../types/types'
import { logger } from '../utils/logger'


// Logger tag
const TAG = 'Messaging'

// FCM topic for receiving queries
const TOPIC = 'CMNM_QUERY'

// AsyncStorage key
const STORAGE_KEY = '@cmnm/subscribed'

// Request permissions for messaging if they haven't yet been provided
export async function requestMessagingPermissions(): Promise<boolean> {
  try {
    const authStatus = await messaging().requestPermission()
    const { AuthorizationStatus } = messaging
    const hasPermission = [ AuthorizationStatus.AUTHORIZED, AuthorizationStatus.PROVISIONAL ].includes(authStatus)
    logger.log(TAG, 'Requested messaging permissions, granted =', hasPermission)
    return hasPermission
  } catch (error) {
    logger.error(TAG, 'Failed to request messaging permissions', error)
    return false
  }
}

// Check if messaging is enabled
export async function isMessagingEnabled(): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEY)
    const result = value === 'true'
    logger.log(TAG, 'Checked if messaging is enabled, result =', result)
    return result
  } catch (error) {
    logger.error(TAG, 'Failed to check if messaging is enabled', error)
    return false
  }
}

// Enable messaging by subscribing to the topic for queries
export async function enableMessaging(): Promise<void> {
  try {
    if (!messaging().isDeviceRegisteredForRemoteMessages) await messaging().registerDeviceForRemoteMessages()
    await messaging().subscribeToTopic(TOPIC)
    await AsyncStorage.setItem(STORAGE_KEY, 'true')
    logger.log(TAG, 'Enabled messaging and subscribed to topic', TOPIC)
  } catch (error) {
    logger.error(TAG, 'Failed to enable messaging', error)
  }
}

// Disable messaging by unsubscribing from the topic for queries
export async function disableMessaging(): Promise<void> {
  try {
    if (messaging().isDeviceRegisteredForRemoteMessages) await messaging().unregisterDeviceForRemoteMessages()
    await messaging().unsubscribeFromTopic(TOPIC)
    await AsyncStorage.setItem(STORAGE_KEY, 'false')
    logger.log(TAG, 'Disabled messaging and unsubscribed from topic', TOPIC)
  } catch (error) {
    logger.error(TAG, 'Failed to disable messaging', error)
  }
}

// Add a foreground message listener, returns the remover function that must be called before the app closes
export function setForegroundMessageListener(handler: (query: FCMDataMessage) => unknown): () => void {
  logger.log(TAG, 'Setting foreground message listener')
  const unsubscribe = messaging().onMessage(async message => {
    try {
      logger.log(TAG, 'Foreground message received', message.data)
      await handler(message.data as FCMDataMessage)
    } catch (error) {
      logger.error(TAG, 'Failed to handle foreground message', error)
    }
  })
  return () => {
    logger.log(TAG, 'Removing foreground message listener')
    unsubscribe()
  }
}

// Add a background message listener, must be used outside the root component
export function setBackgroundMessageListener(handler: (query: FCMDataMessage) => unknown): void {
  logger.log(TAG, 'Setting background message listener')
  messaging().setBackgroundMessageHandler(async message => {
    try {
      logger.log(TAG, 'Background message received', message.data)
      await handler(message.data as FCMDataMessage)
    } catch (error) {
      logger.error(TAG, 'Failed to handle background message', error)
    }
  })
}
