import { faker } from '@faker-js/faker'
import * as uuid from 'uuid'
import { Measurement } from '../types/types'


// function that generate fake measurements
export const generateMeasurement = (count: number): Measurement[] => {
  const now = Date.now()
  const weekAgo = Date.now() - 6.048e+8
  const query = uuid.v4()

  const list: Measurement[] = []
  for (let i = 0; i < count; i++) {
    list.push({
      id: uuid.v4(),
      queryId: query,
      timestamp: faker.date.between(weekAgo, now).valueOf(),
      coordinates: {
        latitude: Number(faker.address.latitude(60.3, 60.15, 6)),
        longitude: Number(faker.address.longitude(25.2, 24.6, 6))
      },
      bandwidth: faker.datatype.number(faker.datatype.number({ min: 0, max: 50000 })),
      latency: faker.datatype.number(faker.datatype.number({ min: 0, max: 100 })),
      signalStrength: faker.datatype.number({ min: 0, max: 4 })
    })
  }
  return list
}
