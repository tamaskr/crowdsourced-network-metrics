import { FormGroup, styled } from '@mui/material'


const StyledFormGroup = styled(FormGroup)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  gap: theme.spacing(4),
  alignItems: 'center',
  justifyContent: 'center'
}))

const ButtonWrapper = styled('div')({
  display: 'flex',
  justifyContent: 'flex-end'
})

export { StyledFormGroup, ButtonWrapper }
