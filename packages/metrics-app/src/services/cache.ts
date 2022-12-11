import AsyncStorage from '@react-native-async-storage/async-storage'
import { logger } from '../utils/logger'


// Logger tag
const TAG = 'Cache'

// AsyncStorage key
const STORAGE_KEY = '@cmnm/cache'

// Expiry of the cache is one minute (in milliseconds)
const EXPIRY = 60 * 1000

interface CachedMeasurements {
  area: string | null
  carrier: string | null
  bandwidth: number | null
  latency: number | null
  signalStrength: number | null
}

// Retrieve cached measurements from AsyncStorage if they haven't yet expired
export async function getCachedMeasurements(): Promise<CachedMeasurements | null> {
  try {
    const cache = await AsyncStorage.getItem(STORAGE_KEY)
    if (!cache) return null
    const { expiry, ...data } = JSON.parse(cache)
    if (expiry < Date.now()) return null
    logger.log(TAG, 'Retrieved cached measurements from storage')
    return data
  } catch (error) {
    logger.error(TAG, 'Failed to load cached measurements', error)
    return null
  }
}

// Cache measurements to AsyncStorage for one minute to avoid draining the device's resources
export async function setCacheMeasurements(measurements: CachedMeasurements): Promise<void> {
  try {
    const data = { ...measurements, expiry: Date.now() + EXPIRY }
    const stringified = JSON.stringify(data)
    await AsyncStorage.setItem(STORAGE_KEY, stringified)
    logger.log(TAG, 'Cached measurements to storage')
  } catch (error) {
    logger.error(TAG, 'Failed to write cached measurements', error)
  }
}
