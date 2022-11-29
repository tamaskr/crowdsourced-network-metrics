import { NextPage } from 'next'
import { Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import Link from 'next/link'
import { useMemo } from 'react'
import { Layout } from '../../components/layout'
import {  getMeasurementsByQueryId } from '../../services/queries'
import { Loading } from '../../components/loading'
import { Measurement } from '../../types/measurement'


const Details: NextPage = () => {
  const router = useRouter()
  const { id } = router.query
  console.log('queryId')
  console.log(id)

  const { isLoading, data } = useQuery(
    [ `/getMeasurmentsByqueryId?queryId=${id}` ],
    () =>
      getMeasurementsByQueryId(id as string).catch(() =>
        toast.error('Error while fetching measurement data')),
    {
      cacheTime: 0,
      refetchOnWindowFocus: false,
      enabled: !!id
    }
  )
  const fetchedData: Measurement[] = useMemo(() => {
    if (!data?.data) return []
    console.log(data.data.length)
    return data.data
  }, [ data ])

  return (
    <Layout>
      <Typography>Details</Typography>
      {isLoading ? (
        <Loading />
      ) : (
        <Typography>
          {fetchedData.map(item => (
            <div key={item.queryId}>
              <h1>{item.latency}</h1>
            </div>

          ))}
        </Typography>
      )}
    </Layout>
  )
}

export default Details

/*
*/
