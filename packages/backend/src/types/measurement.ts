interface ICoordinates {
  latitude: number
  longitude: number
}

export interface IMeasurement {
  bandwidth: number
  coordinates: ICoordinates
  id: string
  latency: number
  queryId: string
  signalStrength: number
}

export enum MeasurementValues {
  BANDWIDTH = 'bandwidth',
  LATENCY = 'latency',
  SIGNAL_STRENGTH = 'signalStrength'
}
