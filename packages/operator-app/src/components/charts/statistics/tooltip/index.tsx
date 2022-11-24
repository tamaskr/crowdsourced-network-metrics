import { Typography } from '@mui/material'


export const CustomToolTipLabel = ({
  label,
  color,
  value,
  unit
}: {
  label: string
  color: string
  value?: number | null
  unit?: string
}) => {
  return (
    <Typography color={color}>
      {label}
      <Typography fontWeight="bold" display="inline">
        {value
          ? `: ${Math.round(value).toLocaleString('en')} ${unit ?? ''}`
          : ': no data'}
      </Typography>
    </Typography>
  )
}
