import { faker } from '@faker-js/faker'
import * as uuid from 'uuid'
import { Measurement, MeasurementType, Query } from '../types/types'


// Generate mock query and measurements
export const generateMockData = (count: number): [ Query, Measurement[] ] => {
  // Generate timestamp
  const now = Date.now()
  const weekAgo = Date.now() - 6.048e+8
  const timestamp = faker.date.between(weekAgo, now).valueOf()

  // Generate coordinates
  const coordinates = {
    latitude: Number(faker.address.latitude(60.3, 60.15, 6)),
    longitude: Number(faker.address.longitude(25.2, 24.6, 6))
  }

  // Generate query
  const query: Query = {
    id: uuid.v4(),
    timestamp,
    measurements: [ MeasurementType.Bandwidth, MeasurementType.Latency, MeasurementType.SignalStrength ],
    coordinates,
    range: 0.01,
    responseCount: count
  }

  // Generate measurements
  const measurements: Measurement[] = []
  for (let i = 0; i < count; i++) {
    measurements.push({
      id: uuid.v4(),
      queryId: query.id,
      timestamp,
      coordinates,
      bandwidth: faker.datatype.number(faker.datatype.number({ min: 0, max: 50000 })),
      latency: faker.datatype.number(faker.datatype.number({ min: 0, max: 100 })),
      signalStrength: faker.datatype.number({ min: 0, max: 4 })
    })
  }

  return [ query, measurements ]
}
