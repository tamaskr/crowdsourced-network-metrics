import { Measurement } from '../types/measurement'
import { storeMeasurement } from '../utils/asyncStorage'
import { logger } from '../utils/logger'


// Logger tag
const TAG = 'Backend'

// Report a measurement to the backend to be stored
export async function report(measurement: Omit<Measurement, 'id' | 'timestamp'>) {
  logger.log(TAG, 'Reporting measurements...')
  try {
    const url = 'https://europe-west1-crowdsourced-network-metrics.cloudfunctions.net/report'
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(measurement)
    const response = await fetch(url, { method: 'POST', headers, body })
    const responseData = await response.json()
    if (response.status !== 200) {
      logger.error(TAG, 'Reporting measurements failed', responseData.errors)
    } else {
      logger.log(TAG, 'Reporting measurements successful')
      // Save measurement value to AsyncStorage
      responseData.data && await storeMeasurement(responseData.data)
    }
  } catch (error) {
    logger.error(TAG, 'Reporting measurements failed', error)
  }
}
