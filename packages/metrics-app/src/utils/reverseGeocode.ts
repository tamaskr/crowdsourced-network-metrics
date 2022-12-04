import { Coordinate } from '../services/location'
import { logger } from './logger'


// Logger tag
const TAG = 'Geocoder'

// Get the area (aka locality) of the coordinates
export async function getArea(coordinates: Coordinate): Promise<string | null> {
  try {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode?latitude=${coordinates?.latitude}&longitude=${coordinates?.longitude}&localityLanguage=en&key=${process.env.REACT_APP_BIGDATACLOUD_API_KEY}`
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
