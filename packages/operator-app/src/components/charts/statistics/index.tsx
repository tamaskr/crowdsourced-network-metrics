import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography
} from '@mui/material'
import { format, isSameDay } from 'date-fns'
import {
  ResponsiveContainer,
  LineChart,
  Legend,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  Line,
  TooltipProps
} from 'recharts'
import {
  ValueType,
  NameType
} from 'recharts/src/component/DefaultTooltipContent'
import { theme } from '../../../theme/default'
import { FormattedChartData } from '../../../types/chart'
import { MeasurementUnits } from '../../../types/measurement'
import { getYAxisLabel } from '../../../utils/chart'
import { FilterContainer } from './styles'
import { CustomToolTipLabel } from './tooltip'


export const StatisticsChart = ({
  chartData,
  days,
  onDaysChange
}: {
  chartData: FormattedChartData[]
  days: number
  onDaysChange: (event: SelectChangeEvent<number>) => void
}) => {
  const CustomTooltip = ({
    active,
    payload,
    label
  }: TooltipProps<ValueType, NameType>) => {
    const dailyMeasurement = chartData.find(data =>
      isSameDay(new Date(label), data.timestamp))
    if (active && payload && payload.length > 0 && !!dailyMeasurement) {
      const { bandwidth, latency, signalStrength } = dailyMeasurement
      return (
        <div style={{ padding: theme.spacing(2), border: 'none' }}>
          <Typography fontWeight="bold">{`${format(
            new Date(label),
            'yyyy MMMM do'
          )}`}</Typography>
          <CustomToolTipLabel
            label="Avg bandwidth"
            color={theme.palette.warning.dark}
            value={bandwidth}
            unit={MeasurementUnits.BANDWIDTH}
          />
          <CustomToolTipLabel
            label="Avg latency"
            color={theme.palette.primary.main}
            value={latency}
            unit={MeasurementUnits.LATENCY}
          />
          <CustomToolTipLabel
            label="Avg signal strength"
            color={theme.palette.grey[700]}
            value={signalStrength}
          />
        </div>
      )
    }
    return null
  }

  return (
    <>
      <FilterContainer>
        <FormControl style={{ width: '350px', paddingRight: theme.spacing(2) }}>
          <InputLabel>Location</InputLabel>
          <Select value="all" label="Location" defaultValue="all">
            <MenuItem value="all">All locations</MenuItem>
          </Select>
        </FormControl>
        <FormControl style={{ width: '300px' }}>
          <InputLabel>Time period</InputLabel>
          <Select
            value={days}
            label="Time period"
            onChange={onDaysChange}
            defaultValue={days}
          >
            <MenuItem value={3}>Past 3 days</MenuItem>
            <MenuItem value={7}>Past 7 days</MenuItem>
            <MenuItem value={14}>Past 14 days</MenuItem>
            <MenuItem value={30}>Past 30 days</MenuItem>
            <MenuItem value={60}>Past 60 days</MenuItem>
            <MenuItem value={180}>Past 180 days</MenuItem>
          </Select>
        </FormControl>
      </FilterContainer>
      <ResponsiveContainer width='100%' height={580}>
        <LineChart data={chartData} margin={{ bottom: 12, left: 26, top: 12, right: 12 }} >
          <Legend verticalAlign="top" height={50} />
          <CartesianGrid stroke={theme.palette.grey[300]} strokeDasharray="4" />
          <XAxis
            dataKey="timestamp"
            dy={18}
            tickFormatter={label => format(new Date(label), 'MMM d')}
          />
          <YAxis
            tickMargin={12}
            type="number"
            domain={[ 0, 100 ]}
            allowDataOverflow
            tickFormatter={value => getYAxisLabel(value)}
          />

          <Tooltip
            content={<CustomTooltip />}
            filterNull={false}
            wrapperStyle={{
              outline: 'none',
              backgroundColor: theme.palette.background.paper,
              boxShadow: '0px 0px 4px 0px rgba(0,0,0,0.2)'
            }}
          />
          <Line
            name="Signal strength"
            type="monotone"
            dataKey="signalStrengthChart"
            stroke={theme.palette.grey[700]}
            strokeWidth={2}
          />
          <Line
            name="Latency"
            type="monotone"
            dataKey="latencyChart"
            stroke={theme.palette.primary.main}
            strokeWidth={2}
          />
          <Line
            name="Bandwidth"
            type="monotone"
            dataKey="bandwidthChart"
            stroke={theme.palette.warning.dark}
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </>
  )
}
