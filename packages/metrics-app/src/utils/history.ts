import AsyncStorage from '@react-native-async-storage/async-storage'
import { Measurement } from '../types/types'
import { logger } from './logger'


// Logger tag
const TAG = 'History'

// AsyncStorage key
const STORAGE_KEY = '@cmnm/history'

// Store measurement in AsyncStorage
export async function saveMeasurementToHistory(measurement: Measurement): Promise<void> {
  try {
    logger.log(TAG, 'Saving measurement data...')
    const history = await AsyncStorage.getItem(STORAGE_KEY)
    const parsedHistory: Measurement[] = history ? JSON.parse(history) : []
    parsedHistory.push({
      ...measurement,
      // Convert kilobyte to megabit (125 kB = 1 Mbit)
      bandwidth: measurement.bandwidth
        ? Number.parseFloat((measurement.bandwidth / 125).toFixed(1))
        : null
    })
    const stringifiedHistory = JSON.stringify(parsedHistory)
    await AsyncStorage.setItem(STORAGE_KEY, stringifiedHistory)
    logger.log(TAG, 'Measurement data saved')
  } catch (error) {
    logger.error(TAG, 'Failed to save measurement history', error)
  }
}
