import { faker } from '@faker-js/faker'
import * as uuid from 'uuid'
import { IMeasurement } from '../types/measurement'

// function that generate fake measurements
export const generateMeasurement = (limit: number): Array<IMeasurement> => {
  if (limit < 1) return []
  const list: Array<IMeasurement> = []
  for (let i = 0; i < limit; i++) {
    list.push({
      bandwidth: faker.datatype.number(faker.datatype.number({ min: 0, max: 500000 })),
      coordinates: {
        latitude: Number(faker.address.latitude(60.3, 60.15, 6)),
        longitude: Number(faker.address.longitude(25.2, 24.6, 6))
      },
      id: uuid.v4(),
      latency: faker.datatype.number(faker.datatype.number({ min: 0, max: 5000 })),
      queryId: uuid.v4(),
      signalStrength: faker.datatype.number({ min: 0, max: 4 })
    })
  }
  return list
}
