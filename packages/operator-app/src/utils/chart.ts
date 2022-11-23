import { addDays, isSameDay, startOfTomorrow } from 'date-fns'
import { ChartLabels, FormattedChartData } from '../types/chart'
import { Measurement, MeasurementType } from '../types/measurement'


// Formats the labels on the statistics chart's Y axis from 0-100
export const getYAxisLabel = (value: number) => {
  return ChartLabels[value / 25]
}

// Returns average measurement values for the given array (null values are also returned)
export const getMeasurementAverages = (measurements: Measurement[]): {
  bandwidth: number | null
  latency: number | null
  signalStrength: number | null
} => {
  // Map an array that either includes the average for the measurement type or null
  const averagesArray = Object.values(MeasurementType).map(type => {
    // Get all of the non-null measurement values
    const values = measurements
      .map(measurement => measurement[type])
      .filter(Boolean)
    // Sum up the values before calculating the average
    const sum = values.reduce((a, b) => Number(a) + Number(b), 0)
    // If there are no usable values, return null for the average
    if (values.length === 0 || !sum) return { [type]: null }
    return { [type]: Math.round(sum / values.length) }
  })
  // Group all the data into one object
  return Object.assign({}, ...averagesArray)
}

// Calculates bandwidth quality for statistics chart
export const getNormalizedBandwidth = (bandwidth: number) => {
  const value = bandwidth / 220
  return value > 100 ? 100 : value
}

// Calculates latency quality for statistics chart
export const getNormalizedLatency = (latency: number) => {
  const value = latency > 100 ? 100 : latency
  return 100 - value
}

// Calculates signal strength quality for statistics chart
export const getNormalizedSignalStrength = (signalStrength: number) => {
  return signalStrength * 25
}

// Returns an object with measurement type properties, which are formatted to fit the statistics chart's 0-100 format
export const getNormalizedChartMeasurements = (measurements: {
  bandwidth: number | null
  latency: number | null
  signalStrength: number | null
}) => {
  // Map out the measurements and calculate the chart values for each of them
  const normalizedArray = Object.entries(measurements).map(([ key, value ], _) => {
    const chartKey = `${key}Chart`
    if (value === null)
      return {
        [chartKey]: null
      }
    switch (key) {
      case MeasurementType.BANDWIDTH: {
        return {
          [chartKey]: getNormalizedBandwidth(value)
        }
      }
      case MeasurementType.LATENCY: {
        return {
          [chartKey]: getNormalizedLatency(value)
        }
      }
      case MeasurementType.SIGNAL_STRENGTH: {
        return {
          [chartKey]: getNormalizedSignalStrength(value)
        }
      }
    }
  })
  // Group all the data into one object
  return Object.assign({}, ...normalizedArray)
}

// Endpoint data is formatted for the statistics chart
export const formatChartData = (measurements: Measurement[], days: number): FormattedChartData[] => {
  let currentDay = startOfTomorrow()
  const chartData = []
  // Depending on the "days" parameter, the chart will display data for the past x days, with data grouped to each day
  for (let i = 0; i < days; i++) {
    currentDay = addDays(currentDay, -1)
    // Filter measurements for the specific day
    const dailyMeasurements = measurements.filter(measurement =>
      isSameDay(measurement.timestamp, currentDay))
    // Get average measurement values (or null, if there are no measurements for that day)
    const averages = getMeasurementAverages(dailyMeasurements)
    // Format average values to fit the statistics chart formatting
    const normalizedAverages = getNormalizedChartMeasurements(averages)
    chartData.push({
      timestamp: currentDay,
      ...averages,
      ...normalizedAverages
    })
  }
  // Sort data so the days are in ascending order from left to right on the chart
  return chartData.sort((a, b) => Number(a.timestamp) - Number(b.timestamp))
}
