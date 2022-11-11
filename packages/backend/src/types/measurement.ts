export interface ICoordinates {
  [index: number]: string
}

export interface IMeasurement {
  id: string
  queryId: string
  coordinates: ICoordinates
  signalStrength: number
  latency: number
  bandwidth: number
}
