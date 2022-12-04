import { Typography } from '@mui/material'
import { CustomToolTipLabelProps } from './types'


export const CustomToolTipLabel = ({
  label,
  color,
  value,
  unit,
  rounded = true
}: CustomToolTipLabelProps) => {
  return (
    <div>
      <Typography color={color} display="inline">
        {label}
      </Typography>
      <Typography color={color} fontWeight="bold" display="inline">
        {value
          ? `: ${(rounded
            ? Math.round(value)
            : value.toFixed(1)
          ).toLocaleString('en')} ${unit ?? ''}`
          : ': no data'}
      </Typography>
    </div>
  )
}
