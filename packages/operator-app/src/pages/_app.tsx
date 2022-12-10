import { CssBaseline, ThemeProvider } from '@mui/material'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Head from 'next/head'
import { theme } from '../theme/default'
import type { AppProps } from 'next/app'
// Required CSS import for react-toastify library
import 'react-toastify/dist/ReactToastify.css'
// Required CSS import for react-mapbox-gl library
import 'mapbox-gl/dist/mapbox-gl.css'


// Initialize query client for react-query
// https://tanstack.com/query/v4/docs/reference/QueryClient
const queryClient = new QueryClient()

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Head>
          <title>CMNM Operator</title>
        </Head>
        <Component {...pageProps} />
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
