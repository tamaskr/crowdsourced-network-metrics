import * as Location from 'expo-location'
import { logger } from '../utils/logger'


const TAG = 'Location'

// Check if permissions for location have been granted and request them if not
// eslint-disable-next-line import/exports-last
export async function checkLocationPermissions(): Promise<boolean> {
  logger.log(TAG, 'Checking location permissions...')
  try {
    const hasPermission = await Location.requestForegroundPermissionsAsync()
    if (hasPermission.status === 'granted') {
      logger.log(TAG, 'Checked location permissions, granted', hasPermission)
      const permission = await askPermission()
      return permission
    }
    return true
  } catch (error) {
    logger.error(TAG, 'Failed to check location permissions', error)
    return false
  }
}
// ask if permissions for location have been granted if not
async function askPermission(): Promise<boolean> {
  const permission = await Location.requestForegroundPermissionsAsync()
  return permission.status === 'granted'
}
// Get the current location of the device as coordinates
export async function getCurrentCoordinates(): Promise<{
  latitude: number
  longitude: number
} | null> {
  logger.log(TAG, 'Getting current coordinates...')
  try {
    const hasPermission = await checkLocationPermissions()
    if (!hasPermission) {
      logger.log(TAG, 'Permission to access location was denied')
      return null
    }
    const location = await Location.getCurrentPositionAsync()
    const coordinates = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    }
    logger.log(TAG, 'Gotten current coordinates', coordinates)
    return coordinates
  } catch (error) {
    logger.error(TAG, 'Failed to get current coordinates', error)
    return null
  }
}
