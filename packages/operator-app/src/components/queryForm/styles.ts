import { FormGroup, styled } from '@mui/material'


const StyledFormGroup = styled(FormGroup)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  gap: theme.spacing(4),
  alignItems: 'center',
  justifyContent: 'center'
}))

const ButtonWrapper = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  marginTop: theme.spacing(2)
}))

export { StyledFormGroup, ButtonWrapper }
