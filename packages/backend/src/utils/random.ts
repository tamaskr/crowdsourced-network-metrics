import { faker } from '@faker-js/faker'
import * as uuid from 'uuid'
import { Measurement, MeasurementType, Query } from '../types/types'


// Generate mock query and measurements
export const generateMockData = (count: number): [ Query[], Measurement[] ] => {
  const queries: Query[] = []
  const measurements: Measurement[] = []
  for (let i = 0; i < count; i++) {
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
    const queryId = uuid.v4()
    const responseCount = faker.datatype.number({ min: 5, max: 25 })
    queries.push({
      id: queryId,
      timestamp,
      measurements: [ MeasurementType.Bandwidth, MeasurementType.Latency, MeasurementType.SignalStrength ],
      coordinates,
      range: 2000,
      responseCount
    })

    // Generate measurements
    for (let i = 0; i < responseCount; i++) {
      measurements.push({
        id: uuid.v4(),
        queryId,
        timestamp,
        coordinates,
        area: null,
        carrier: null,
        bandwidth: faker.datatype.number({ min: 0, max: 50000 }),
        latency: faker.datatype.number({ min: 0, max: 100 }),
        signalStrength: faker.datatype.number({ min: 0, max: 4 })
      })
    }
  }

  // Return generated queries and measurements
  return [ queries, measurements ]
}
