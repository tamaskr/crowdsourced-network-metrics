import { Typography } from '@mui/material'
import { isSameDay, format } from 'date-fns'
import { theme } from '../../../../theme/default'
import { MeasurementUnits } from '../../../../types/measurement'
import { CustomToolTipLabel } from './label'
import { CustomTooltipProps } from './types'


export const CustomTooltip = ({
  active,
  payload,
  label,
  chartData
}: CustomTooltipProps) => {
  // Find value from chart data, which matches the currently active day
  const dailyMeasurement = chartData.find(data =>
    isSameDay(new Date(label), data.timestamp))

  // Return early if the tooltip is not active
  if (!(active && payload && payload.length > 0 && !!dailyMeasurement))
    return null

  // Destructure all measurement values from the active chart data
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
        color={theme.palette.success.main}
        value={signalStrength}
        rounded={false}
      />
    </div>
  )
}
