import { MeasurementType } from './../../types/measurement'


export interface QueryFormProps {
  onSubmit: ({
    measurements,
    longitude,
    latitude,
    range
  }: {
    measurements: MeasurementType[]
    longitude: number
    latitude: number
    range: number
  }) => Promise<void>
}
