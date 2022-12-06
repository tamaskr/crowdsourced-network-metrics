import { MeasurementType } from '../../types/measurement'


export interface QueryDTO {
  measurements: MeasurementType[]
  longitude: number
  latitude: number
  range: number
}

export interface QueryFormProps {
  onSubmit: ({
    measurements,
    longitude,
    latitude,
    range
  }: QueryDTO) => Promise<void>
}
