import { createTheme } from '@mui/material'
import { red } from '@mui/material/colors'

// Module augmentation for customized MaterialUI theme
declare module '@mui/material/styles' {
  interface Theme {
    customPalette: {
      purple: string
      red: string
    }
    chart: {
      unknown: string
      poor: string
      moderate: string
      good: string
      excellent: string
    }
  }
  // Allow configuration using `createTheme`
  interface ThemeOptions {
    customPalette: {
      purple?: string
      red?: string
    }
    chart?: {
      purple?: string
      red?: string
      unknown?: string
      poor?: string
      moderate?: string
      good?: string
      excellent?: string
    }
  }
}

// Default MaterialUI theme with custom color scheme
// https://mui.com/material-ui/customization/theming/
export const theme = createTheme({
  palette: {
    primary: {
      main: '#3A506B'
    },
    secondary: {
      light: '#FEFCFD',
      main: '#AAA6C9',
      dark: '#000505'
    },
    error: {
      main: red[300]
    }
  },
  customPalette: {
    purple: '#8884D8',
    red: '#FF2800'
  },
  chart: {
    unknown: '#ADADAD',
    poor: '#D44627',
    moderate: '#FFC30B',
    good: '#68B14B',
    excellent: '#0D95D0'
  }
})
