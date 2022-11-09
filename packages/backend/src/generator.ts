import * as functions from 'firebase-functions'
import { faker } from '@faker-js/faker'
import * as uuid from "uuid";


export const measurement = functions.region('europe-west1').https.onRequest((request, response) => {
  functions.logger.info('Hello logs!', { structuredData: true })
  response.send(measurementObject)
})


const measurementObject = {
  id: uuid.v4(),
  queryId: uuid.v4(),
  coordinates: [
    faker.address.latitude(60.3, 60.15, 6),
    faker.address.longitude(24.6, 24.2, 6)
  ],
  signalStrength: faker.datatype.number({min: 0, max: 4 }),
  latency: faker.datatype.number(faker.datatype.number({ min: 1, max: 500000 })),
  bandwidth: faker.datatype.number(faker.datatype.number({ min: 1, max: 500000 }))
}
