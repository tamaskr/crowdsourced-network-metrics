import { logger } from '../utils/logger'


// Logger tag
const TAG = 'Location'

// Check if permissions for location have been granted and request them if not
export async function checkLocationPermissions(): Promise<boolean> {
  logger.log(TAG, 'Checking location permissions...')
  try {
    const hasPermission = true // TODO implement functionality
    logger.log(TAG, 'Checked location permissions, granted', hasPermission)
    return hasPermission
  } catch (error) {
    logger.error(TAG, 'Failed to check location permissions', error)
    return false
  }
}

// Get the current location of the device as coordinates
export async function getCurrentCoordinates(): Promise<{ latitude: number; longitude: number } | null> {
  logger.log(TAG, 'Getting current coordinates...')
  try {
    const coordinates = { latitude: 60.2, longitude: 24.8 } // TODO implement functionality
    logger.log(TAG, 'Gotten current coordinates', coordinates)
    return coordinates
  } catch (error) {
    logger.error(TAG, 'Failed to get current coordinates', error)
    return null
  }
}
