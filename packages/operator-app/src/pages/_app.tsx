import { CssBaseline, ThemeProvider } from '@mui/material'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Head from 'next/head'
import { theme } from '../theme/default'
import type { AppProps } from 'next/app'
import 'react-toastify/dist/ReactToastify.css'


const queryClient = new QueryClient()

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Head>
          <title>CMNM OPERATOR</title>
        </Head>
        <Component {...pageProps} />
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
