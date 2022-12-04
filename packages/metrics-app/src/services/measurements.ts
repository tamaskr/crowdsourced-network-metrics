import performance, { setResourceLoggingEnabled } from 'react-native-performance'
import { getPermissionsAsync, getSignalStrengthAsync } from 'expo-cellular'
import { PermissionStatus } from 'expo-modules-core'
import { logger } from '../utils/logger'
import { FCMDataMessage, MeasurementType } from '../types/types'
import { getAddress } from '../utils/address'
import { report } from './backend'
import { getDistanceOfCoordinates, getCurrentCoordinates } from './location'

// Logger tag
const TAG = 'Measurements'

// Measure the download bandwidth in kilobytes per second
async function measureDownloadBandwidth(): Promise<number | null> {
  logger.log(TAG, 'Measuring download bandwidth...')
  try {
    const url
      = 'https://storage.googleapis.com/cmnm-measurement-files/binary25mb'
    const results = []
    setResourceLoggingEnabled(true)
    results[0] = await fetch(url, {
      method: 'GET',
      headers: { 'cache-content': 'no-cache' },
      mode: 'no-cors'
    })
    delete results[0]
    results[1] = await fetch(url, {
      method: 'GET',
      headers: { 'cache-content': 'no-cache' },
      mode: 'no-cors'
    })
    delete results[1]
    setResourceLoggingEnabled(false)
    const duration
      = performance.getEntriesByName(url, 'resource').pop()?.duration ?? 0
    const kbps = Math.round((25 * 1024 * 1000) / duration)
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
    const url = 'https://1.1.1.1/cdn-cgi/trace'
    setResourceLoggingEnabled(true)
    for (let i = 0; i < 10; i++) {
      await fetch(url, {
        method: 'HEAD',
        headers: { 'cache-content': 'no-cache' },
        mode: 'no-cors'
      })
    }
    setResourceLoggingEnabled(false)
    const durations = performance
      .getEntriesByName(url, 'resource')
      .slice(-10)
      .map(x => x.duration)
    const roundTrip = Math.round(durations.reduce((acc, cur) => Math.min(acc, cur), durations[0]))
    const ms = Math.round(roundTrip / 2)
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
    const permission = await getPermissionsAsync()
    const granted = permission.status === PermissionStatus.GRANTED
    const value = granted ? await getSignalStrengthAsync() : null
    logger.log(TAG, 'Measured signal strength is', value)
    return value
  } catch (error) {
    logger.error(TAG, 'Failed to measure signal strength', error)
    return null
  }
}

export async function performMeasurementsFromQuery(query: FCMDataMessage): Promise<void> {
  logger.log(TAG, 'Performing measurement for query', query.id)
  try {
    // Check location
    const coordinates = await getCurrentCoordinates()
    if (!coordinates) {
      logger.warn(
        TAG,
        'Aborted performing measurements as coordinates cannot be obtained'
      )
      return
    }
    // Check area of location
    const area = await getAddress()
    if (!area) {
      logger.warn(
        TAG,
        'Aborted performing measurements as area cannot be obtained'
      )
      return
    }

    // Parse coordinates and range from query
    const center = { latitude: Number.parseFloat(query.latitude), longitude: Number.parseFloat(query.longitude) }
    const range = Number.parseFloat(query.range)

    // Check that the coordinates are within the queried area
    const distance = getDistanceOfCoordinates(center, coordinates)
    if (distance > range) {
      logger.log(TAG, 'Aborted performing measurements as coordinates are out of the queried range')
      return
    }

    // Take measurements
    const bandwidth = query.measurements.includes(MeasurementType.Bandwidth)
      ? await measureDownloadBandwidth()
      : null
    const latency = query.measurements.includes(MeasurementType.Latency)
      ? await measureLatency()
      : null
    const signalStrength = query.measurements.includes(MeasurementType.SignalStrength)
      ? await measureSignalStrength()
      : null

    // Report measurements
    await report({
      queryId: query.id,
      bandwidth,
      latency,
      signalStrength,
      coordinates,
      area
    })
    logger.log(TAG, 'Performed measurements successfully')
  } catch (error) {
    logger.error(TAG, 'Failed to perform measurements', error)
  }
}
