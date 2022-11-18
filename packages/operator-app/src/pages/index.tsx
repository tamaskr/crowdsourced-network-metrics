import { LoadingButton } from '@mui/lab'
import { Divider, FormControl, FormGroup, Typography } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { NextPage } from 'next'
import { useEffect } from 'react'
import { Field, Form, Formik } from 'formik'
import { toast } from 'react-toastify'
import SendIcon from '@mui/icons-material/Send'
import { array, object } from 'yup'
import { CheckboxWithLabel } from 'formik-material-ui'
import { Layout } from '../components/layout'
import { getMeasurements, postQuery } from '../services/queries'
import { theme } from '../theme/default'
import { MeasurementType } from '../types/measurement'


const measurementOptions = [
  {
    label: 'bandwidth',
    value: MeasurementType.BANDWIDTH
  },
  {
    label: 'latency',
    value: MeasurementType.LATENCY
  },
  {
    label: 'signal strength',
    value: MeasurementType.SIGNAL_STRENGTH
  }
]


const Home: NextPage = () => {
  const {
    isLoading: isMeasurementLoading,
    error: measurementError,
    data: measurementData,
    mutate: mutateMeasurement
  } = useMutation(getMeasurements, {
    cacheTime: 0
  })

  const {
    error: queryError,
    data: queryData,
    mutateAsync: mutateQuery
  } = useMutation(
    (measurements: MeasurementType[]) => postQuery(measurements),
    {
      cacheTime: 0
    }
  )

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

  // Show toasts for query request
  useEffect(() => {
    if (queryError) {
      toast.error('Error while trying to make a query')
    }
    if (queryData?.error) {
      toast.error(queryData.error)
    }
    if (queryData?.messageId) {
      toast.success(`Query successful with id ${queryData?.messageId}`)
    }
  }, [ queryError, queryData ])

  return (
    <Layout>
      <Typography variant="h4" lineHeight={theme.spacing(5)}>
        Fetch all measurements
      </Typography>
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
      <Divider
        sx={{ marginTop: theme.spacing(2), marginBottom: theme.spacing(2) }}
      />
      <Typography variant="h4" lineHeight={theme.spacing(5)}>
        Send a new query
      </Typography>
      <Typography variant="body1">
        Choose the measurement types that should be requested from the devices
        (you must select at least one measurement type)
      </Typography>
      <Formik
        initialValues={{
          measurements: [ MeasurementType.BANDWIDTH ]
        }}
        onSubmit={async values => {
          await mutateQuery(values.measurements)
        }}
        validationSchema={object().shape({
          measurements: array()
            .min(1, 'Select at least 1 measurement')
            .required('required')
        })}
      >
        {({ errors, isSubmitting }) => (
          <Form>
            <FormControl component="fieldset" sx={{ display: 'flex' }}>
              <FormGroup>
                {measurementOptions.map(({ value, label }) => (
                  <Field
                    type="checkbox"
                    component={CheckboxWithLabel}
                    name="measurements"
                    key={value}
                    value={value}
                    Label={{ label }}
                  />
                ))}
              </FormGroup>
            </FormControl>
            {!!errors && <Typography color="error">{errors.measurements}</Typography>}
            <LoadingButton
              disabled={!!errors.measurements}
              loading={isSubmitting}
              endIcon={<SendIcon />}
              variant="contained"
              sx={{ marginTop: theme.spacing(1) }}
              type="submit"
            >
              Send query
            </LoadingButton>
          </Form>
        )}
      </Formik>
    </Layout>
  )
}

export default Home
