import * as admin from 'firebase-admin'
import { applicationDefault, FirebaseError } from 'firebase-admin/app'
import * as functions from 'firebase-functions'
import * as uuid from 'uuid'
import { Measurements } from './types/measurements'


admin.initializeApp({ credential: applicationDefault() })

const QUERY_TOPIC = 'CMNM_QUERY'

// Send message to all of the devices, which have the metrics app installed
export const query =  functions.region('europe-west1').https.onRequest(async (request, response) =>  {
  // Set payload data with unique query ID and requested measurement types
  const payload = { data: { id: uuid.v4(), measurements: JSON.stringify([ Measurements.BANDWIDTH ]) } }

  try {
    // Send FCM message to all devices that are subscribed to the query topic
    const msg = await admin.messaging().sendToTopic(
      QUERY_TOPIC,
      payload,
      {
        // Required for background messages on iOS
        contentAvailable: true,
        // Required for background messages on Android
        priority: 'high'
      }
    )
    response.status(200).send({ ok: true, ...msg })
  } catch (error) {
    response.status(500).send({ error: (error as FirebaseError).message })
  }
})
