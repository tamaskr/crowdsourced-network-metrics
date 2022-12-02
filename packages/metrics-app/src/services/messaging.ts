import messaging from '@react-native-firebase/messaging'
import { FCMDataMessage } from '../types/types'
import { logger } from '../utils/logger'


// Query topic
const TOPIC = 'CMNM_QUERY'

// Logger tag
const TAG = 'Messaging'

// Check if permissions for messaging have been granted and request them if not
export async function checkMessagingPermissions(): Promise<boolean> {
  logger.log(TAG, 'Checking messaging permissions...')
  try {
    const authStatus = await messaging().requestPermission()
    const { AuthorizationStatus } = messaging
    const hasPermission = [ AuthorizationStatus.AUTHORIZED, AuthorizationStatus.PROVISIONAL ].includes(authStatus)
    logger.log(TAG, 'Checked messaging permissions, granted', hasPermission)
    return hasPermission
  } catch (error) {
    logger.error(TAG, 'Failed to check messaging permissions', error)
    return false
  }
}

// Enable messaging by subscribing to the topic for queries
export async function enableMessaging(): Promise<void> {
  logger.log(TAG, 'Enabling messaging...')
  try {
    if (!messaging().isDeviceRegisteredForRemoteMessages) await messaging().registerDeviceForRemoteMessages()
    await messaging().subscribeToTopic(TOPIC)
    logger.log(TAG, 'Enabled messaging and subscribed to topic', TOPIC)
  } catch (error) {
    logger.error(TAG, 'Failed to enable messaging', error)
  }
}

// Disable messaging by unsubscribing from the topic for queries
export async function disableMessaging(): Promise<void> {
  logger.log(TAG, 'Disabling messaging...')
  try {
    if (messaging().isDeviceRegisteredForRemoteMessages) await messaging().unregisterDeviceForRemoteMessages()
    await messaging().unsubscribeFromTopic(TOPIC)
    logger.log(TAG, 'Disabled messaging and unsubscribed from topic', TOPIC)
  } catch (error) {
    logger.error(TAG, 'Failed to disable messaging', error)
  }
}

// Add a foreground message listener, returns the remover function that must be called before the app closes
export function setForegroundMessageListener(handler: (query: FCMDataMessage) => unknown): () => void {
  logger.log(TAG, 'Adding foreground message listener')
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

// Add a background message listener, use it outside the root component
export function setBackgroundMessageListener(handler: (query: FCMDataMessage) => unknown) {
  logger.log(TAG, 'Adding background message listener')
  messaging().setBackgroundMessageHandler(async message => {
    try {
      logger.log(TAG, 'Background message received', message.data)
      await handler(message.data as FCMDataMessage)
    } catch (error) {
      logger.error(TAG, 'Failed to handle background message', error)
    }
  })
}
