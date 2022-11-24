import { CircularProgress } from '@mui/material'
import { LoadingWrapper } from './styles'


export const Loading = () => {
  return (
    <LoadingWrapper>
      <CircularProgress />
    </LoadingWrapper>
  )
}
