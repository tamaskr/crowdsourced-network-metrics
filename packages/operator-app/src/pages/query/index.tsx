import { LoadingButton } from '@mui/lab'
import { FormControl, FormGroup, Typography } from '@mui/material'
import { useMutation } from '@tanstack/react-query'
import { NextPage } from 'next'
import { useEffect } from 'react'
import { Field, Form, Formik } from 'formik'
import { toast } from 'react-toastify'
import SendIcon from '@mui/icons-material/Send'
import { array, object } from 'yup'
import { CheckboxWithLabel } from 'formik-material-ui'
import { Layout } from '../../components/layout'
import { postQuery } from '../../services/queries'
import { theme } from '../../theme/default'
import { MeasurementType } from '../../types/measurement'


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

const Query: NextPage = () => {
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
      <Typography variant="h4">Send a new query</Typography>
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
            {!!errors && (
              <Typography color="error">{errors.measurements}</Typography>
            )}
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

export default Query
