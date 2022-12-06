import { useQuery } from '@tanstack/react-query'
import { NextPage } from 'next'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import Link from 'next/link'
import { Pagination, Typography } from '@mui/material'
import { Layout } from '../components/layout'
import { getQueries } from '../services/queries'
import { Query } from '../types/measurement'
import { Loading } from '../components/loading'
import { QueryCard } from '../components/queryCard'
import { theme } from '../theme/default'

// Modify the query array to only show queries for a specififc page
const paginate = (queries: Query[], pageSize: number, currentPage: number) => {
  return queries.slice((currentPage - 1) * pageSize, currentPage * pageSize)
}

const Home: NextPage = () => {
  // Stores the amount of pages that the user can navigate to
  const [ pageCount, setPageCount ] = useState<number>(1)
  // Page that the user is currently on
  const [ currentPage, setCurrentPage ] = useState<number>(1)
  // Max number of queries shown on the page at once
  const pageSize = 10

  const { isLoading, data } = useQuery([ 'queries' ], () => getQueries(), {
    cacheTime: 0,
    refetchOnWindowFocus: false,
    onSuccess: data =>
      setPageCount(Math.ceil(data.queries.length / pageSize)),
    onError: () => toast.error('Error while fetching query data')
  })

  // When the user use pagination, scroll to the top of the page
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }, [ currentPage ])

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

    // Sort the queries by date and use pagination before rendering
    const formattedQueries = paginate(
      data.queries.sort((a: Query, b: Query) => b.timestamp - a.timestamp),
      pageSize,
      currentPage
    )

    return (
      <div>
        {formattedQueries.map((query: Query) => (
          <div key={query.id} style={{ marginBottom: theme.spacing(2) }}>
            <Link
              href={`/details?id=${query.id}`}
              passHref
              style={{ textDecoration: 'none' }}
            >
              <QueryCard query={query} />
            </Link>
          </div>
        ))}
        {pageCount > 1 && (
          <Pagination
            page={currentPage}
            count={pageCount}
            shape="rounded"
            onChange={(_, page) => {
              setCurrentPage(page)
            }}
          />
        )}
      </div>
    )
  }, [ data, isLoading, pageCount, currentPage ])

  return <Layout>{children}</Layout>
}

export default Home
