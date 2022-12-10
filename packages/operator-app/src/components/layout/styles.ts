import { Grid, styled } from '@mui/material'
import { Box } from '@mui/system'


const Wrapper = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  backgroundColor: theme.palette.secondary.light
}))

const Container = styled(Grid)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
})

const ContentContainer = styled(Grid)(({ theme }) => ({
  width: '100%',
  maxWidth: '1920px',
  padding: theme.spacing(3)
}))

export { Wrapper, Container, ContentContainer }
