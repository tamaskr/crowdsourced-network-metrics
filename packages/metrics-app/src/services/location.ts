import * as Location from 'expo-location'
import { logger } from '../utils/logger'


// Logger tag
const TAG = 'Location'

export interface Coordinate {
  latitude: number
  longitude: number
}

// Request permissions for location if they haven't yet been provided
export async function requestLocationPermissions(): Promise<boolean> {
  try {
    logger.log(TAG, 'Requesting location permissions...')
    const foregroundPermissionResponse = await Location.requestForegroundPermissionsAsync()
    logger.log(TAG, 'Requested foreground location permissions, granted =', foregroundPermissionResponse.granted)
    const backgroundPermissionResponse = await Location.requestBackgroundPermissionsAsync()
    logger.log(TAG, 'Requested background location permissions, granted =', backgroundPermissionResponse.granted)
    return foregroundPermissionResponse.granted && backgroundPermissionResponse.granted
  } catch (error) {
    logger.error(TAG, 'Failed to request location permissions', error)
    return false
  }
}

// Get the current location of the device as coordinates
export async function getCurrentCoordinates(): Promise<Coordinate | null> {
  try {
    logger.log(TAG, 'Getting current coordinates...')
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

  // Return the distance multiplied by the Earth's radius in meters
  return Math.round(distance * 6378137)
}

// Get the area (aka locality) of the coordinates
export async function getReverseGeocodedArea(coordinate: Coordinate): Promise<string | null> {
  try {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode?latitude=${coordinate?.latitude}&longitude=${coordinate?.longitude}&localityLanguage=en`
    const response = await fetch(url)
    if (response.status !== 200) {
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
