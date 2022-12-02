export interface Measurement {
  id: string
  queryId: string
  coordinates: {
    latitude: number
    longitude: number
  }
  area: string
  bandwidth: number | null
  latency: number | null
  signalStrength: number | null
  timestamp: number
}

export interface FormattedQueryData {
  timestamp: number
  queryId: number
}

export enum MeasurementType {
  BANDWIDTH = 'bandwidth',
  LATENCY = 'latency',
  SIGNAL_STRENGTH = 'signalStrength'
}

export interface Query {
  id: string
  measurements: MeasurementType[]
  coordinates: {
    latitude: number
    longitude: number
  }
  range: number
  responseCount: number
  timestamp: number
}

export enum MeasurementUnits {
  BANDWIDTH = 'kB/s',
  LATENCY = 'ms',
}
