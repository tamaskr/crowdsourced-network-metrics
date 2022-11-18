import AsyncStorage from '@react-native-async-storage/async-storage'
import { Measurement } from './../types/measurement'
import { logger } from './logger'


// Logger tag
const TAG = 'AsyncStorage'

export const storeMeasurement = async (measurement: Measurement) => {
  logger.log(TAG, 'Saving measurement data...')
  try {
    const history = await AsyncStorage.getItem('history')
    const parsedHistory = history ? JSON.parse(history) : []
    parsedHistory.push(measurement)
    const measurements = JSON.stringify(parsedHistory)
    await AsyncStorage.setItem('history', measurements)
    logger.log(TAG, 'Saving measurement data success')
  } catch {
    logger.log(TAG, 'Error while saving measurement data')
  }
}
