import { SelectChangeEvent } from '@mui/material'
import { FormattedChartData } from '../../../types/chart'


export interface StatisticsChartProps {
  chartData: FormattedChartData[]
  selectedTimePeriod: number
  selectedArea: string | null
  allAreas: string[]
  handleAreaChange: (event: SelectChangeEvent<string>) => void
  handleDaysChange: (event: SelectChangeEvent<number>) => void
}
