import performance, { setResourceLoggingEnabled } from 'react-native-performance'
import { getCarrierNameAsync, getPermissionsAsync, getSignalStrengthAsync } from 'expo-cellular'
import { PermissionStatus } from 'expo-modules-core'
import { getNetworkStateAsync, NetworkStateType } from 'expo-network'
import { logger } from '../utils/logger'
import { FCMDataMessage, MeasurementType } from '../types/types'
import { reportMeasurementToBackend } from './backend'
import { getDistanceOfCoordinates, getCurrentCoordinates, getReverseGeocodedArea } from './location'
import { getCachedMeasurement, setCacheMeasurement } from './cache'


// Logger tag
const TAG = 'Measurement'

// Measure the download bandwidth in kilobytes per second
async function measureDownloadBandwidth(): Promise<number | null> {
  try {
    logger.log(TAG, 'Measuring download bandwidth...')
    const fileSize = 25 * 1024 * 1000
    const url = 'https://storage.googleapis.com/cmnm-measurement-files/binary25mb'
    const results: unknown[] = []
    setResourceLoggingEnabled(true)
    results[0] = await fetch(url, { method: 'GET', headers: { 'cache-content': 'no-cache' }, mode: 'no-cors' })
    delete results[0]
    results[1] = await fetch(url, { method: 'GET', headers: { 'cache-content': 'no-cache' }, mode: 'no-cors' })
    delete results[1]
    setResourceLoggingEnabled(false)
    // The first request is slower due to establishing the connection, so the duration of the second one must be used
    const duration = performance.getEntriesByName(url, 'resource')?.pop()?.duration ?? Number.NaN
    const kbps = Math.round(fileSize / duration)
    const safe = Number.isSafeInteger(kbps) ? kbps : null
    logger.log(TAG, 'Measured download bandwidth is', safe, 'kbps')
    return safe
  } catch (error) {
    logger.error(TAG, 'Failed to measure download bandwidth', error)
    return null
  }
}

// Measure the latency in milliseconds
async function measureLatency(): Promise<number | null> {
  try {
    logger.log(TAG, 'Measuring latency...')
    const url = 'https://1.1.1.1/cdn-cgi/trace'
    setResourceLoggingEnabled(true)
    for (let i = 0; i < 10; i++) {
      await fetch(url, { method: 'HEAD', headers: { 'cache-content': 'no-cache' }, mode: 'no-cors' })
    }
    setResourceLoggingEnabled(false)
    // Take the lowest of the ten measurements taken
    const durations = performance.getEntriesByName(url, 'resource').slice(-10).map(x => x.duration)
    const roundTrip = Math.round(durations.reduce((acc, cur) => Math.min(acc, cur), durations[0]))
    const ms = Math.round(roundTrip / 2)
    const safe = Number.isSafeInteger(ms) ? ms : null
    logger.log(TAG, 'Measured latency is', safe, 'ms')
    return safe
  } catch (error) {
    logger.error(TAG, 'Failed to measure latency', error)
    return null
  }
}

// Measure the signal strength in values from 0 to 4
async function measureSignalStrength(): Promise<number | null> {
  try {
    logger.log(TAG, 'Measuring signal strength...')
    const permission = await getPermissionsAsync()
    const hasPermission = permission.status === PermissionStatus.GRANTED
    const value = hasPermission ? await getSignalStrengthAsync() : null
    logger.log(TAG, 'Measured signal strength is', value)
    return value
  } catch (error) {
    logger.error(TAG, 'Failed to measure signal strength', error)
    return null
  }
}

// Perform a measurement when receiving a query and report it to the backend
export async function performMeasurement(query: FCMDataMessage): Promise<void> {
  try {
    logger.log(TAG, 'Performing measurement for query', query.id)

    // Check location
    const coordinates = await getCurrentCoordinates()
    if (!coordinates) {
      logger.warn(TAG, 'Aborted performing measurement as coordinates cannot be obtained')
      return
    }

    // Check that the coordinates are within the queried area
    const queryLatitude = Number.parseFloat(query.latitude)
    const queryLongitude = Number.parseFloat(query.longitude)
    const queryCoordinates = { latitude: queryLatitude, longitude: queryLongitude }
    const distance = getDistanceOfCoordinates(queryCoordinates, coordinates)
    const queryRange = Number.parseFloat(query.range)
    if (distance > queryRange) {
      logger.log(TAG, 'Aborted performing measurement as coordinates are out of the queried range')
      return
    }

    // Check that the user is connected to a cellular network or is in dev mode
    const state = await getNetworkStateAsync()
    if (state.type !== NetworkStateType.CELLULAR && !__DEV__) {
      logger.log(TAG, 'Aborted performing measurement as the device is not connected to a cellular network')
      return
    }

    // Check if a cached measurement is available
    const cachedMeasurement = await getCachedMeasurement()
    if (cachedMeasurement) {
      await reportMeasurementToBackend({
        queryId: query.id,
        coordinates,
        area: cachedMeasurement.area,
        carrier: cachedMeasurement.carrier,
        bandwidth: cachedMeasurement.bandwidth,
        latency: cachedMeasurement.latency,
        signalStrength: cachedMeasurement.signalStrength
      })
      return
    }

    // Measure network metrics, check the area, and find the carrier
    const area = await getReverseGeocodedArea(coordinates)
    const carrier = await getCarrierNameAsync()
    const shouldMeasureBandwidth = query.measurements.includes(MeasurementType.Bandwidth)
    const shouldMeasureLatency = query.measurements.includes(MeasurementType.Latency)
    const shouldMeasureSignalStrength = query.measurements.includes(MeasurementType.SignalStrength)
    const bandwidth = shouldMeasureBandwidth ? await measureDownloadBandwidth() : null
    const latency = shouldMeasureLatency ? await measureLatency() : null
    const signalStrength = shouldMeasureSignalStrength ? await measureSignalStrength() : null

    // Cache the measurement
    await setCacheMeasurement({ area, carrier, bandwidth, latency, signalStrength })

    // Report the measurement
    await reportMeasurementToBackend({
      queryId: query.id,
      coordinates,
      area,
      carrier,
      bandwidth,
      latency,
      signalStrength
    })
    logger.log(TAG, 'Performed measurement successfully')
  } catch (error) {
    logger.error(TAG, 'Failed to perform measurement', error)
  }
}
