import { logger } from '../utils/logger'
import { timedRun } from '../utils/timedRun'
import { Query } from '../types/query'
import { report } from './backend'
import { getCurrentCoordinates } from './location'


// Logger tag
const TAG = 'Measurements'

// Measure the download bandwidth in kilobytes per second
async function measureDownloadBandwidth(): Promise<number | null> {
  logger.log(TAG, 'Measuring download bandwidth...')
  try {
    const url = 'https://storage.googleapis.com/cmnm-measurement-files/binary25mb'
    const ms = await timedRun(() => fetch(url, { headers: { 'cache-content': 'no-store' } }), 5)
    const kbps = Math.round(25 * 1024 / (ms / 1000))
    logger.log(TAG, 'Measured download bandwidth is', kbps, 'kbps')
    return kbps
  } catch (error) {
    logger.error(TAG, 'Failed to measure download bandwidth', error)
    return null
  }
}

// Measure the latency in milliseconds
async function measureLatency(): Promise<number | null> {
  logger.log(TAG, 'Measuring latency...')
  try {
    const ms = null // TODO implement functionality
    logger.log(TAG, 'Measured latency is', ms, 'ms')
    return ms
  } catch (error) {
    logger.error(TAG, 'Failed to measure latency', error)
    return null
  }
}

// Measure the signal strength in values from 0 to 4
async function measureSignalStrength(): Promise<number | null> {
  logger.log(TAG, 'Measuring signal strength...')
  try {
    const value = null // TODO implement functionality
    logger.log(TAG, 'Measured signal strength is', value)
    return value
  } catch (error) {
    logger.error(TAG, 'Failed to measure signal strength', error)
    return null
  }
}

export async function performMeasurementsFromQuery(query: Query): Promise<void> {
  logger.log(TAG, 'Performing measurement for query', query.id)
  try {
    // Check location
    const coordinates = await getCurrentCoordinates()
    if (!coordinates) {
      logger.warn(TAG, 'Aborted performing measurements as coordinates cannot be obtained')
      return
    }
    // Take measurements
    const bandwidth = await measureDownloadBandwidth()
    const latency = await measureLatency()
    const signalStrength = await measureSignalStrength()
    // Report measurements
    await report({
      queryId: query.id,
      bandwidth,
      latency,
      signalStrength,
      coordinates
    })
    logger.log(TAG, 'Performed measurements successfully')
  } catch (error) {
    logger.error(TAG, 'Failed to perform measurements', error)
  }
}
