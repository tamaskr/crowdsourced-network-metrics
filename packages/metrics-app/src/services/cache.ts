import AsyncStorage from '@react-native-async-storage/async-storage'
import { logger } from '../utils/logger'


// Logger tag
const TAG = 'Cache'

// Cache key for AsyncStorage
const KEY = 'CachedMeasurements'

// Expiry of the cache is minute (in milliseconds)
const EXPIRY = 60 * 1000

interface CachedMeasurements {
  bandwidth: number | null
  latency: number | null
  signalStrength: number | null
  area: string | null
}

// Get cached measurements from AsyncStorage
export async function getCachedMeasurements(): Promise<CachedMeasurements | null> {
  try {
    const cache = await AsyncStorage.getItem(KEY)
    if (!cache) return null
    const { expiry, ...data } = JSON.parse(cache)
    if (expiry < Date.now()) return null
    logger.log(TAG, 'Loaded cached measurements')
    return data
  } catch (error) {
    logger.error(TAG, 'Failed to load cached measurements', error)
    return null
  }
}

// Set cached measurements to AsyncStorage
export async function setCacheMeasurements(measurements: CachedMeasurements): Promise<void> {
  try {
    const data = { ...measurements, expiry: Date.now() + EXPIRY }
    const stringified = JSON.stringify(data)
    await AsyncStorage.setItem(KEY, stringified)
    logger.log(TAG, 'Wrote measurements to cache')
  } catch (error) {
    logger.error(TAG, 'Failed to write cached measurements', error)
  }
}
