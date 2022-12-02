import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as uuid from 'uuid'
import { MEASUREMENT_COLLECTION, QUERY_COLLECTION, REGION } from '../utils/constants'
import { cors } from '../utils/cors'
import { measurementSchema } from '../utils/schemas'
import { Measurement } from '../types/types'


// Report in a measurement in response to a query
export const report = functions.region(REGION).https.onRequest(async (request, response) => {
  try {
    // Handle CORS
    const isPreflight = cors(request, response)
    if (isPreflight) return

    // Allow only POST requests to pass further
    if (request.method !== 'POST') {
      response.status(405).header('Allow', 'POST').json({ success: false })
      return
    }

    // Validate the request body with the schema
    const schema = measurementSchema.pick({ queryId: true, bandwidth: true, latency: true, signalStrength: true, coordinates: true })
    const result = schema.safeParse(request.body)
    if (!result.success) {
      response.status(400).json({ success: false, message: result.error.message, errors: result.error.errors })
      return
    }

    // Data format for storing data in the database
    const measurement: Measurement = { id: uuid.v4(), timestamp: Date.now(), ...result.data }

    // Save the measurement to the database
    await admin.firestore().collection(MEASUREMENT_COLLECTION).doc(measurement.id).set(measurement)

    // Increment the response count of the query by one
    const update = { responseCount: admin.firestore.FieldValue.increment(1) }
    await admin.firestore().collection(QUERY_COLLECTION).doc(measurement.queryId).update(update)

    // Respond with the created measurement
    response.status(200).json({ success: true, measurement })
  } catch (error) {
    console.error(error)
    response.status(500).json({ success: false })
  }
})
