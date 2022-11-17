import { FunctionComponent, ReactNode } from 'react'
import { ToastContainer } from 'react-toastify'
import { NavBar } from '../navBar'
import { Container, ContentContainer, Wrapper } from './styles'


export const Layout: FunctionComponent<{
  children?: ReactNode
}> = ({ children }) => {
  return (
    <Wrapper>
      <Container container>
        <NavBar />
        <ToastContainer />
        <ContentContainer item md={12} xl={10}>
          {children}
        </ContentContainer>
      </Container>
    </Wrapper>
  )
}
