import { SelectChangeEvent } from '@mui/material'
import { FormattedChartData } from '../../../types/chart'


export interface StatisticsChartProps {
  chartData: FormattedChartData[]
  selectedArea: string | null
  allAreas: string[]
  handleAreaChange: (event: SelectChangeEvent<string>) => void
  selectedCarrier: string | null
  allCarriers: string[]
  handleCarrierChange: (event: SelectChangeEvent<string>) => void
  selectedTimePeriod: number
  handleDaysChange: (event: SelectChangeEvent<number>) => void
}
