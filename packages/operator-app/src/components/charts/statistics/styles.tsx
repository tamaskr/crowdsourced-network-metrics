import { FormControl, styled } from '@mui/material'


const FilterContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexGrow: 1,
  gap: theme.spacing(2),
  flexWrap: 'wrap',
  justifyContent: 'flex-end',
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  alignItems: 'center'
}))

const FilterForm = styled(FormControl)(({ theme }) => ({
  minWidth: '300px',
  [theme.breakpoints.down('md')]: {
    minWidth: '100%'
  }
}))

export { FilterContainer, FilterForm }
