import { MeasurementType } from '../types/measurement'

// Lists all measurement types with labels
export const measurementOptions = [
  {
    label: 'bandwidth',
    value: MeasurementType.BANDWIDTH
  },
  {
    label: 'latency',
    value: MeasurementType.LATENCY
  },
  {
    label: 'signal strength',
    value: MeasurementType.SIGNAL_STRENGTH
  }
]
