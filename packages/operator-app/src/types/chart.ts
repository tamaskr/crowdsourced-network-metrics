export enum ChartLabels {
  Unusable,
  Poor,
  Average,
  Good,
  Excellent,
}

export interface FormattedChartData {
  timestamp: number
  bandwidth: number | null
  latency: number | null
  signalStrength: number | null
  bandwidthChart: number | null
  latencyChart: number | null
  signalStrengthChart: number | null
}
