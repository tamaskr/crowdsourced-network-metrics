import * as Location from 'expo-location'
import { logger } from '../utils/logger'


// Logger tag
const TAG = 'Location'

// Radius of the Earth in meters
const EARTH_RADIUS = 6378137

export interface Coordinate {
  latitude: number
  longitude: number
}

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
export async function getCurrentCoordinates(): Promise<Coordinate | null> {
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

// Calculate the distance between two coordinates in meters
// Courtesy of sebastiansandqvist at https://github.com/sebastiansandqvist/s-haversine
export function getDistanceOfCoordinates(coordinate1: Coordinate, coordinate2: Coordinate): number {
  // Get the latitudes and longitudes from the coordinates
  const { latitude: latitude1, longitude: longitude1 } = coordinate1
  const { latitude: latitude2, longitude: longitude2 } = coordinate2

  // Utility to convert degrees to radians
  const degToRad = (deg: number) => deg * (Math.PI / 180)

  // Calculate the difference between latitudes and longitudes, convereted to radii
  const latitudeDifference = degToRad(latitude2 - latitude1)
  const longitudeDifference = degToRad(longitude2 - longitude1)

  // Calculate the distance
  const n = Math.sin(latitudeDifference / 2) * Math.sin(latitudeDifference / 2)
    + Math.cos(degToRad(latitude1)) * Math.cos(degToRad(latitude2))
    * Math.sin(longitudeDifference / 2) * Math.sin(longitudeDifference / 2)
  const distance = 2 * Math.atan2(Math.sqrt(n), Math.sqrt(1 - n))

  // Return the distance multiplied by the Earth's radius
  return Math.round(EARTH_RADIUS * distance)
}

// Get the area (aka locality) of the coordinates
export async function getReverseGeocodedArea(coordinate: Coordinate): Promise<string | null> {
  try {
    const BIGDATACLOUD_API_KEY = 'bdc_ec1c6c097de9484c8db9633444fb8cca'
    const url = `https://api.bigdatacloud.net/data/reverse-geocode?latitude=${coordinate?.latitude}&longitude=${coordinate?.longitude}&localityLanguage=en&key=${BIGDATACLOUD_API_KEY}`
    const response = await fetch(url)

    if (!response.ok) {
      logger.error(TAG, 'Failed to reverse geocode the area')
      return null
    }

    const data = await response.json()
    const area = data.locality ?? null
    logger.log(TAG, 'Reverse geocoded area is', area)
    return area
  } catch (error) {
    logger.error(TAG, 'Failed to reverse geocode the area', error)
    return null
  }
}
