import { styled } from '@mui/material'


const FilterContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexGrow: 1,
  justifyContent: 'flex-end',
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  alignItems: 'center'
}))

export { FilterContainer }
