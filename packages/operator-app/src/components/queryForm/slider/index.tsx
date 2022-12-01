import { Slider } from '@mui/material'
import { SliderWrapper } from './styles'
import { QuerySliderProps } from './types'

// Marks for the map slider to select query range
const marks = [
  {
    value: 100,
    label: '100 m'
  },
  {
    value: 1000,
    label: '1 000 m'
  },
  {
    value: 2000,
    label: '2 000 m'
  },
  {
    value: 5000,
    label: '5 000 m'
  },
  {
    value: 10000,
    label: '10 000 m'
  },
  {
    value: 15000,
    label: '15 000 m'
  }
]

export const QuerySlider = ({ range, onChange }: QuerySliderProps) => {
  return (
    <SliderWrapper>
      <Slider
        defaultValue={range}
        min={100}
        step={10}
        max={15000}
        valueLabelFormat={(value: number) => `${value} m`}
        marks={marks}
        valueLabelDisplay="on"
        onChange={(_, newValue) => onChange(_, newValue)}
      />
    </SliderWrapper>
  )
}
