import { useQuery } from '@tanstack/react-query'
import { NextPage } from 'next'
import { useMemo } from 'react'
import { toast } from 'react-toastify'
import Link from 'next/link'
import { Typography } from '@mui/material'
import { Layout } from '../components/layout'
import { getQueries } from '../services/queries'
import { Query } from '../types/measurement'
import { Loading } from '../components/loading'
import { QueryCard } from '../components/queryCard'
import { theme } from '../theme/default'


const Home: NextPage = () => {
  const { isLoading, data } = useQuery([ 'queries' ], () => getQueries(), {
    cacheTime: 0,
    refetchOnWindowFocus: false,
    onError: () => toast.error('Error while fetching query data')
  })

  const children = useMemo(() => {
    if (isLoading) return <Loading />

    if (!data?.queries || data?.queries?.length === 0)
      return (
        <Typography
          variant="h5"
          color={theme.palette.text.primary}
          textAlign="center"
        >
          No queries available
        </Typography>
      )

    return data.queries
      .sort((a: Query, b: Query) => b.timestamp - a.timestamp)
      .map((query: Query) => (
        <div key={query.id} style={{ marginBottom: theme.spacing(2) }}>
          <Link
            href={`/details?id=${query.id}`}
            passHref
            style={{ textDecoration: 'none' }}
          >
            <QueryCard query={query} />
          </Link>
        </div>
      ))
  }, [ data, isLoading ])

  return <Layout>{children}</Layout>
}

export default Home
