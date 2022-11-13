export interface Measurement {
  id: string
  queryId: string
  timestamp: number
  coordinates: {
    latitude: number
    longitude: number
  }
  bandwidth?: number | null
  latency?: number | null
  signalStrength?: number | null
}
