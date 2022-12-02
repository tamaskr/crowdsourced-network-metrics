import { Typography } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { NextPage } from 'next'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { Layout } from '../../components/layout'
import { postQuery } from '../../services/queries'
import { theme } from '../../theme/default'
import { MeasurementType } from '../../types/measurement'
import { QueryForm } from '../../components/queryForm'


const Query: NextPage = () => {
  const {
    error,
    data,
    mutateAsync: makeQuery
  } = useMutation(
    ({
      measurements,
      longitude,
      latitude,
      range
    }: {
      measurements: MeasurementType[]
      longitude: number
      latitude: number
      range: number
    }) => postQuery({ measurements, longitude, latitude, range }),
    {
      cacheTime: 0
    }
  )

  // Show toasts for query request
  useEffect(() => {
    if (error) {
      toast.error('Error while trying to make a query')
    }
    if (data?.error) {
      toast.error(data.error)
    }
    if (data?.query?.id) {
      toast.success(`Query successful with id ${data?.query?.id}`)
    }
  }, [ error, data ])

  return (
    <Layout>
      <Typography
        variant="h4"
        fontWeight="bold"
        color={theme.palette.primary.main}
        textAlign="center"
      >
        SEND A NEW QUERY
      </Typography>
      <Typography
        variant="body1"
        textAlign="center"
        sx={{ marginTop: theme.spacing(1), marginBottom: theme.spacing(1) }}
      >
        Choose the measurement types that should be requested from the devices
        (you must select at least one measurement type)
      </Typography>
      <QueryForm
        onSubmit={async ({
          measurements,
          longitude,
          latitude,
          range
        }: {
          measurements: MeasurementType[]
          longitude: number
          latitude: number
          range: number
        }) => {
          await makeQuery({
            measurements,
            longitude,
            latitude,
            range
          })
        }}
      />
    </Layout>
  )
}

export default Query
