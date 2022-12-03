import { styled } from '@mui/material'


const CardContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  backgroundColor: theme.palette.common.white,
  borderRadius: theme.spacing(2),
  boxShadow: '1px 2px 9px #c9c9c9',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    boxShadow: '1px 2px 9px #9e9e9e',
    transform: 'scale3d(1.005, 1.005, 1)'
  }
}))

const MapContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flex: 1,
  minHeight: '220px',
  backgroundColor: theme.palette.primary.main,
  borderTopRightRadius: theme.spacing(2),
  borderBottomRightRadius: theme.spacing(2),
  [theme.breakpoints.down('md')]: {
    minHeight: '290px'
  }
}))

const ContentContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flex: 1,
  gap: theme.spacing(0.5),
  position: 'relative',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(2)
}))

const MeasurementCardsContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1)
}))

const MeasurementCard = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  textAlign: 'center',
  backgroundColor: theme.palette.primary.dark,
  padding: `${theme.spacing(0.5)} ${theme.spacing(1.5)}`,
  borderRadius: theme.spacing(1.5)
}))

const FloatingCountContainer = styled('div')(({ theme }) => ({
  position: 'absolute',
  top: 0,
  right: 0,
  padding: `${theme.spacing(0.5)} ${theme.spacing(2)}`,
  borderBottomLeftRadius: theme.spacing(1.5),
  backgroundColor: theme.palette.primary.dark
}))

export {
  CardContainer,
  ContentContainer,
  MapContainer,
  MeasurementCardsContainer,
  MeasurementCard,
  FloatingCountContainer
}
