import { styled } from '@mui/material'
import { Box } from '@mui/system'


const LoadingWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'center',
  paddingTop: theme.spacing(6)
}))

export { LoadingWrapper }
