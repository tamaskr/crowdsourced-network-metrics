import { createTheme } from '@mui/material'
import { red } from '@mui/material/colors'


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
  }
})
