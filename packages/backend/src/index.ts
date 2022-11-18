import * as admin from 'firebase-admin'
import { applicationDefault, FirebaseError } from 'firebase-admin/app'
import * as functions from 'firebase-functions'
import * as uuid from 'uuid'
import validate from 'validate.js'
import { measurementValidationConstraints } from './utils/validation'
import { Measurement, MeasurementType } from './types/measurement'
import { MEASUREMENT_COLLECTION, QUERY_TOPIC } from './constants'


admin.initializeApp({ credential: applicationDefault() })
admin.firestore().settings({ ignoreUndefinedProperties: true })

export * from './generator'

// Send message to all the devices, which have the metrics app installed
export const query = functions
  .region('europe-west1')
  .https.onRequest(async (request, response) => {
    const { measurements } = request.body

    // Handle CORS
    response.setHeader('Access-Control-Allow-Origin', '*')
    if (request.method === 'OPTIONS') {
      response.status(204).send('')
      return
    }

    // Return error if no measurements property is passed to the request body
    if (!measurements || !validate.isArray(measurements)) {
      response.status(400).send({ error: 'Missing measurements array' })
      return
    }

    // Check if there are any valid measurement types in the passed array
    const validMeasurements = Object.values(MeasurementType).filter(measurement =>
      validate.contains(measurements, measurement))

    // Return error if no valid measurement types are present
    if (validMeasurements.length === 0) {
      response
        .status(400)
        .send({ error: 'No valid value passed for measurement types' })
      return
    }

    // Set payload data with unique query ID and requested measurement types
    const payload = {
      data: {
        id: uuid.v4(),
        measurements: JSON.stringify(validMeasurements)
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
    // Handle CORS
    response.setHeader('Access-Control-Allow-Origin', '*')
    if (request.method === 'OPTIONS') {
      response.status(204).send('')
      return
    }

    // Get all the query data from the request body
    const { queryId, bandwidth, latency, signalStrength, coordinates }
      = request.body

    // Return error in case of missing parameters
    if (!coordinates?.latitude || !coordinates?.longitude || !queryId) {
      response.status(400).send({ error: 'Some required params are missing' })
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
    const normalizedData: Measurement = {
      id: uniqueId,
      queryId,
      timestamp: Date.now(),
      coordinates: validate.cleanAttributes(coordinates, {
        latitude: true,
        longitude: true
      }),
      bandwidth: bandwidth ?? null,
      latency: latency ?? null,
      signalStrength: signalStrength ?? null
    }

    // Validate data before adding the measurement to the database
    const errors = validate(normalizedData, measurementValidationConstraints)

    if (errors) {
      response.status(400).send({ error: 'Incorrect params', errors })
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
        .send({
          ok: true,
          message: `Measurement added with id ${uniqueId}`,
          data: normalizedData
        })
    } catch (error) {
      response.status(500).send({ error: (error as FirebaseError).message })
    }
  })

// Returns all measurements from the database
export const measurements = functions
  .region('europe-west1')
  .https.onRequest(async (request, response) => {
    // Handle CORS
    response.setHeader('Access-Control-Allow-Origin', '*')
    if (request.method === 'OPTIONS') {
      response.status(204).send('')
      return
    }
    // Fetches all measurements from the Firestore database collection
    await admin
      .firestore()
      .collection(MEASUREMENT_COLLECTION)
      .get()
      .then(querySnapshot => {
        const data: Measurement[] = []
        querySnapshot.forEach(doc => {
          // Validates data before pushing to the response's data array
          const errors = validate(doc.data(), measurementValidationConstraints)
          if (!errors) data.push(doc.data() as Measurement)
        })
        response.status(200).send({ ok: true, data })
      })
      .catch(error => {
        response.status(500).send({ error: (error as FirebaseError).message })
      })
  })
