export interface Measurement {
  id: string
  queryId: string
  timestamp: number
  coordinates: {
    latitude: number
    longitude: number
  }
  bandwidth: number | null
  latency: number | null
  signalStrength: number | null
}

export enum MeasurementType {
  BANDWIDTH = 'bandwidth',
  LATENCY = 'latency',
  SIGNAL_STRENGTH = 'signalStrength'
}

export enum MeasurementUnits {
  BANDWIDTH = 'kB/s',
  LATENCY = 'ms',
}
