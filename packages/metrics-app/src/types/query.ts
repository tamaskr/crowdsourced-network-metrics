export interface Query {
  id: string
  measurements: QueryMeasurementType[]
}

export enum QueryMeasurementType {
  Bandwidth = 'bandwidth',
  Latency = 'latency',
  SignalStrength = 'signalStrength'
}
