import { InputLabel, MenuItem, Select, Typography } from '@mui/material'
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
import { MeasurementUnits } from '../../../types/measurement'
import { getYAxisLabel } from '../../../utils/chart'
import { FilterContainer, FilterForm } from './styles'
import { CustomToolTipLabel } from './tooltipLabel'
import { StatisticsChartProps } from './types'


export const StatisticsChart = ({
  chartData,
  selectedArea,
  allAreas,
  handleAreaChange,
  selectedCarrier,
  allCarriers,
  handleCarrierChange,
  selectedTimePeriod,
  handleDaysChange
}: StatisticsChartProps) => {
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
            rounded={false}
          />
        </div>
      )
    }
    return null
  }

  return (
    <>
      <FilterContainer>
        <FilterForm>
          <InputLabel>Location</InputLabel>
          <Select
            value={selectedArea ?? 'all'}
            label="Location"
            onChange={handleAreaChange}
            defaultValue="all"
          >
            <MenuItem value="all">All locations</MenuItem>
            {allAreas.map(area => (
              <MenuItem value={area} key={area}>
                {area}
              </MenuItem>
            ))}
          </Select>
        </FilterForm>
        <FilterForm>
          <InputLabel>Carrier</InputLabel>
          <Select
            value={selectedCarrier ?? 'all'}
            label="Carrier"
            onChange={handleCarrierChange}
            defaultValue="all"
          >
            <MenuItem value="all">All carriers</MenuItem>
            {allCarriers.map(carrier => (
              <MenuItem value={carrier} key={carrier}>
                {carrier}
              </MenuItem>
            ))}
          </Select>
        </FilterForm>
        <FilterForm>
          <InputLabel>Time period</InputLabel>
          <Select
            value={selectedTimePeriod}
            label="Time period"
            onChange={handleDaysChange}
            defaultValue={7}
          >
            <MenuItem value={3}>Past 3 days</MenuItem>
            <MenuItem value={7}>Past 7 days</MenuItem>
            <MenuItem value={14}>Past 14 days</MenuItem>
            <MenuItem value={30}>Past 30 days</MenuItem>
            <MenuItem value={60}>Past 60 days</MenuItem>
            <MenuItem value={180}>Past 180 days</MenuItem>
          </Select>
        </FilterForm>
      </FilterContainer>
      <ResponsiveContainer width="100%" height={580}>
        <LineChart
          data={chartData}
          margin={{ bottom: 12, left: 26, top: 12, right: 12 }}
        >
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
