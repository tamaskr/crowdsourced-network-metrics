import { LoadingButton } from '@mui/lab'
import { Typography } from '@mui/material'
import { useMutation, useQuery } from '@tanstack/react-query'
import { NextPage } from 'next'
import { useEffect, useMemo } from 'react'
import { toast } from 'react-toastify'
import Link from 'next/link'
import { Layout } from '../components/layout'
import { getMeasurements } from '../services/queries'
import { theme } from '../theme/default'
import { FormattedQueryData } from '../types/measurement'
import { Loading } from '../components/loading'


const Home: NextPage = () => {
  const {
    isLoading: isMeasurementLoading,
    error: measurementError,
    data: measurementData,
    mutate: mutateMeasurement
  } = useMutation(getMeasurements, {
    cacheTime: 0
  })

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

  const fetchedData: FormattedQueryData[] = useMemo(() => {
    if (!data?.data) return []
    return data.data
  }, [ data ])

  // Show toasts for measurement data fetching and log data to console if available
  useEffect(() => {
    if (measurementError) {
      toast.error('Error while fetching measurement data')
    }
    if (measurementData?.data) {
      toast.success(`Measurements fetched successully! (${measurementData.data.length} items)`)
      console.log('Measurement data')
      console.log(measurementData.data)
    }
  }, [ measurementError, measurementData ])

  const keyId = 'queryId'
  const sortedMeasurements = [ ...new Map(fetchedData.map(item => [ item[keyId], item ])).values() ]

  return (
    <Layout>
      <Typography variant="h4">Fetch all measurements</Typography>
      <Typography variant="body1">
        Press the button below and wait for the measurement data to show up in
        console - request could take up to 10-15 seconds to finish
      </Typography>
      <LoadingButton
        onClick={() => mutateMeasurement()}
        loading={isMeasurementLoading}
        variant="contained"
        sx={{ marginTop: theme.spacing(1) }}
      >
        Fetch data
      </LoadingButton>
      {isLoading ? (
        <Loading />
      ) : (

        <ul>
          {sortedMeasurements.map(({ queryId, timestamp }) => (
            <Link href={`/details?id=${queryId}`} key={`/details?id=${queryId}`}>
              <li key={queryId}>{timestamp}</li>
            </Link>
          ))}
        </ul>


      )}
    </Layout>
  )
}

export default Home
