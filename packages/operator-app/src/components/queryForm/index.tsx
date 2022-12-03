import { LoadingButton } from '@mui/lab'
import { FormControl, Typography } from '@mui/material'
import { Formik, Form, Field } from 'formik'
import { CheckboxWithLabel } from 'formik-material-ui'
import SendIcon from '@mui/icons-material/Send'
import { object, array, number } from 'yup'
import { theme } from '../../theme/default'
import { MeasurementType } from '../../types/measurement'
import { convertToDecimalDegrees } from '../../utils/coordinates'
import { measurementOptions } from '../../utils/measurement'
import { QueryDTO, QueryFormProps } from './types'
import { QueryMap } from './map'
import { ButtonWrapper, StyledFormGroup } from './styles'
import { QuerySlider } from './slider'

// Basic validation schema for query form
const validationSchema = object().shape({
  measurements: array()
    .min(1, 'Select at least 1 measurement')
    .required('required'),
  longitude: number().required('required'),
  latitude: number().required('required'),
  range: number().required('required')
})

export const QueryForm = ({ onSubmit }: QueryFormProps) => {
  return (
    <Formik
      initialValues={{
        measurements: [
          MeasurementType.BANDWIDTH,
          MeasurementType.LATENCY,
          MeasurementType.SIGNAL_STRENGTH
        ],
        latitude: 60.171342,
        longitude: 24.940873,
        range: 2000
      }}
      onSubmit={async ({
        measurements,
        longitude,
        latitude,
        range
      }: QueryDTO) => {
        const formattedRange = convertToDecimalDegrees(range)
        await onSubmit({
          measurements,
          longitude,
          latitude,
          range: formattedRange
        })
      }}
      validationSchema={validationSchema}
    >
      {({ values, errors, isSubmitting, setValues }) => {
        return (
          <Form>
            <FormControl component="fieldset" sx={{ display: 'flex' }}>
              <StyledFormGroup>
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
              </StyledFormGroup>
            </FormControl>
            {!!errors && (
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Typography color="error">{errors.measurements}</Typography>
              </div>
            )}
            <ButtonWrapper>
              <LoadingButton
                disabled={!!errors.measurements}
                loading={isSubmitting}
                endIcon={<SendIcon />}
                variant="contained"
                sx={{
                  padding: `${theme.spacing(1)} ${theme.spacing(3)}`
                }}
                type="submit"
              >
                Send query
              </LoadingButton>
            </ButtonWrapper>
            <QuerySlider
              range={values.range}
              onChange={(_, newValue) => {
                setValues(values => ({
                  ...values,
                  range: newValue as number
                }))
              }}
            />
            <QueryMap
              longitude={values.longitude}
              latitude={values.latitude}
              range={values.range}
              onDrag={({ lngLat: { lng, lat } }) => {
                setValues(values => ({
                  ...values,
                  longitude: Number(lng.toFixed(6)),
                  latitude: Number(lat.toFixed(6))
                }))
              }}
            />
          </Form>
        )
      }}
    </Formik>
  )
}
