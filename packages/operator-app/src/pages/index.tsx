import { useQuery } from '@tanstack/react-query'
import { NextPage } from 'next'
import { useMemo } from 'react'
import { toast } from 'react-toastify'
import Link from 'next/link'
import { Layout } from '../components/layout'
import { getMeasurements } from '../services/queries'
import { FormattedQueryData, Measurement } from '../types/measurement'
import { Loading } from '../components/loading'


const Home: NextPage = () => {
  const { isLoading, data } = useQuery(
    [ '/measurements' ],
    () =>
      getMeasurements().catch(() =>
        toast.error('Error while fetching measurement data')),
    {
      cacheTime: 0,
      refetchOnWindowFocus: false
    }
  )

  const uniqueQueries: FormattedQueryData[] = useMemo(() => {
    if (!data?.measurements) return []
    return data.measurements.filter((value: Measurement, index: number, self: Measurement[]) =>
      self.findIndex((measurement: Measurement) => measurement.queryId === value.queryId) === index)
  }, [ data ])

  return (
    <Layout>
      {isLoading ? (
        <Loading />
      ) : (
        <ul>
          {uniqueQueries.map(({ queryId, timestamp }) => (
            <Link href={`/details?id=${queryId}`} key={queryId}>
              <li key={queryId}>{new Date(timestamp).toLocaleString()}</li>
            </Link>
          ))}
        </ul>
      )}
    </Layout>
  )
}

export default Home
