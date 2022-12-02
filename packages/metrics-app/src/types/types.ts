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

export enum MeasurementType {
  Bandwidth = 'bandwidth',
  Latency = 'latency',
  SignalStrength = 'signalStrength'
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

export interface FCMDataMessage {
  [key: string]: string
  id: string
  measurements: string
  latitude: string
  longitude: string
  range: string
}
