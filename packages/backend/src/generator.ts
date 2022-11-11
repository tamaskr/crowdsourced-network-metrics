import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { GenerateMeasurement } from './utils/random'
import { IMeasurement } from './types/measurement'


// function to add documents to collection in firebase db
const setDatabase = (list: Array<IMeasurement>): boolean => {
  try {
    const docRef = admin.firestore().collection('measurements')
    list.map(async (item: IMeasurement) => {
      await docRef.doc(item.id).set(item)
    })
    return true
  } catch (error) {
    functions.logger.error(error, { structuredData: true })
    return false
  }
}

// https request with the query parameter of the desired number of generated documents
export const generate = functions.region('europe-west1').https.onRequest((request, response) => {
  // setting 10 as default amount of added documents
  let count = 10
  if (request.query && request.query.count) {
    count  = +request.query.count
  }
  // safe limit to add max 500 per call (might be deleted)
  if (count > 500) {
    count = 500
  }
  const list: Array<IMeasurement> = GenerateMeasurement(count)
  const status: boolean = setDatabase(list)
  if (!status) {
    response.status(500).send('error 500')
  }
  functions.logger.info(`added ${count} objects`, { structuredData: true })
  response.send('Ok')
})
