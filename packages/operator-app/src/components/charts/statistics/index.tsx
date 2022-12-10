import { InputLabel, MenuItem, Select } from '@mui/material'
import { format } from 'date-fns'
import {
  ResponsiveContainer,
  LineChart,
  Legend,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  Line
} from 'recharts'
import { theme } from '../../../theme/default'
import { getYAxisLabel } from '../../../utils/chart'
import { FilterContainer, FilterForm } from './styles'
import { CustomTooltip } from './tooltip'
import { StatisticsChartProps } from './types'


// Store all parameters, which are required to render customized chart lines
const chartLines = [
  {
    name: 'Signal strength',
    color: theme.palette.success.main,
    key: 'signalStrengthChart'
  },
  {
    name: 'Latency',
    color: theme.palette.primary.main,
    key: 'latencyChart'
  },
  {
    name: 'Bandwidth',
    color: theme.palette.warning.dark,
    key: 'bandwidthChart'
  }
]

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
            content={<CustomTooltip chartData={chartData} />}
            filterNull={false}
            wrapperStyle={{
              outline: 'none',
              backgroundColor: theme.palette.background.paper,
              boxShadow: '0px 0px 4px 0px rgba(0,0,0,0.2)'
            }}
          />
          {chartLines.map(({ name, color, key }) => (
            <Line
              key={key}
              name={name}
              type="monotone"
              dataKey={key}
              stroke={color}
              strokeWidth={2}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </>
  )
}
