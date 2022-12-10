import { TooltipProps } from 'recharts'
import {
  NameType,
  ValueType
} from 'recharts/types/component/DefaultTooltipContent'
import { FormattedChartData } from '../../../../types/chart'


export interface CustomTooltipProps extends TooltipProps<ValueType, NameType> {
  chartData: FormattedChartData[]
}
