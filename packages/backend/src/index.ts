import * as admin from 'firebase-admin'
import { applicationDefault, FirebaseError } from 'firebase-admin/app'
import * as functions from 'firebase-functions'
import * as uuid from 'uuid'
import validate from 'validate.js'
import { measurementValidationConstraints } from './utils/validation'
import { Measurements } from './types/measurements'
import { MEASUREMENT_COLLECTION, QUERY_TOPIC } from './constants'


admin.initializeApp({ credential: applicationDefault() })
admin.firestore().settings({ ignoreUndefinedProperties: true })

export const helloWorld = functions.region('europe-west1').https.onRequest((request, response) => {
  functions.logger.info('Hello logs!', { structuredData: true })
  response.send('Hello not from Firebase!')
})

export * from './generator'

// Send message to all of the devices, which have the metrics app installed
export const query = functions
  .region('europe-west1')
  .https.onRequest(async (request, response) => {
    // Set payload data with unique query ID and requested measurement types
    const payload = {
      data: {
        id: uuid.v4(),
        measurements: JSON.stringify([ Measurements.BANDWIDTH ])
      }
    }

    try {
      // Send FCM message to all devices that are subscribed to the query topic
      const msg = await admin.messaging().sendToTopic(QUERY_TOPIC, payload, {
        // Required for background messages on iOS
        contentAvailable: true,
        // Required for background messages on Android
        priority: 'high'
      })
      response.status(200).send({ ok: true, ...msg })
    } catch (error) {
      response.status(500).send({ error: (error as FirebaseError).message })
    }
  })

// Add a measurement to the Firebase collection
export const report = functions
  .region('europe-west1')
  .https.onRequest(async (request, response) => {
    // Get all the query data from the request body
    const { queryId, bandwidth, latency, signalStrength, coordinates }
      = request.body

    // Return error in case of missing parameters
    if (!coordinates?.latitude || !coordinates?.longitude || !queryId) {
      response
        .status(400)
        .send({ error: 'Some required params are missing' })
      return
    }

    // Check if at least one measurement value is present
    if (!bandwidth && !latency && !signalStrength) {
      response
        .status(400)
        .send({ error: 'At least one measurement value is required' })
      return
    }
    // Generate unique id for measurement
    const uniqueId = uuid.v4()

    // Data format for storing data in the database
    const normalizedData = {
      bandwidth: bandwidth ?? null,
      coordinates: validate.cleanAttributes(coordinates, {
        latitude: true,
        longitude: true
      }),
      id: uniqueId,
      latency: latency ?? null,
      queryId,
      signalStrength: signalStrength ?? null
    }

    // Validate data before adding the measurement to the database
    const errors = validate(normalizedData, measurementValidationConstraints)

    if (errors) {
      response.status(400).send({ error: 'Incorrect params' })
      return
    }

    try {
      // Add measurement to Firestore collection
      await admin
        .firestore()
        .collection(MEASUREMENT_COLLECTION)
        .doc(uniqueId)
        .set(normalizedData)
      response
        .status(200)
        .send({ ok: true, message: `Measurement added with id ${uniqueId}` })
    } catch (error) {
      response.status(500).send({ error: (error as FirebaseError).message })
    }
  })
