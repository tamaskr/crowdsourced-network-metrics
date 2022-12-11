import { Measurement } from '../types/types'
import { saveMeasurementToHistory } from '../utils/history'
import { logger } from '../utils/logger'


// Logger tag
const TAG = 'Backend'

// Report a measurement to the backend to be stored in the database
export async function reportMeasurementToBackend(measurement: Omit<Measurement, 'id' | 'timestamp'>): Promise<void> {
  try {
    logger.log(TAG, 'Reporting measurement...')
    const url = 'https://europe-west1-crowdsourced-network-metrics.cloudfunctions.net/report'
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(measurement)
    const response = await fetch(url, { method: 'POST', headers, body })
    const responseData = await response.json()
    if (response.status !== 200) {
      logger.error(TAG, 'Reporting measurement failed', responseData.errors)
      return
    }
    await saveMeasurementToHistory(responseData.measurement)
    logger.log(TAG, 'Measurement reported successfully')
  } catch (error) {
    logger.error(TAG, 'Reporting measurement failed', error)
  }
}
