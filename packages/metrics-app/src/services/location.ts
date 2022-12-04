import * as Location from 'expo-location'
import { logger } from '../utils/logger'


// Logger tag
const TAG = 'Location'

// Check if permissions for location have been granted and request them if not
export async function checkLocationPermissions(): Promise<boolean> {
  logger.log(TAG, 'Checking location permissions...')
  try {
    const foregroundPermissionResponse = await Location.requestForegroundPermissionsAsync()
    logger.log(TAG, 'Checked foreground location permissions, granted =', foregroundPermissionResponse.granted)
    const backgroundPermissionResponse = await Location.requestBackgroundPermissionsAsync()
    logger.log(TAG, 'Checked background location permissions, granted =', backgroundPermissionResponse.granted)
    return foregroundPermissionResponse.granted && backgroundPermissionResponse.granted
  } catch (error) {
    logger.error(TAG, 'Failed to check location permissions', error)
    return false
  }
}

// Get the current location of the device as coordinates
export async function getCurrentCoordinates(): Promise<{ latitude: number; longitude: number } | null> {
  logger.log(TAG, 'Getting current coordinates...')
  try {
    const foregroundPermissionResponse = await Location.getForegroundPermissionsAsync()
    const backgroundPermissionResponse = await Location.getBackgroundPermissionsAsync()
    if (!foregroundPermissionResponse.granted || !backgroundPermissionResponse.granted) {
      logger.log(TAG, 'Location permissions not granted')
      return null
    }
    const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync()
    const coordinates = { latitude, longitude }
    logger.log(TAG, 'Gotten current coordinates', coordinates)
    return coordinates
  } catch (error) {
    logger.error(TAG, 'Failed to get current coordinates', error)
    return null
  }
}
