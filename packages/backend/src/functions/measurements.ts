import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import { z } from 'zod'
import { MEASUREMENT_COLLECTION, REGION } from '../utils/constants'
import { measurementSchema } from '../utils/schemas'
import { cors } from '../utils/cors'
import { Measurement } from '../types/types'


// Read all measurements or the ones belonging to a query
export const measurements = functions.region(REGION).https.onRequest(async (request, response) => {
  try {
    // Handle CORS
    const isPreflight = cors(request, response)
    if (isPreflight) return

    // Allow only GET requests to pass further
    if (request.method !== 'GET') {
      response.status(405).header('Allow', 'GET').json({ success: false })
      return
    }

    // Validate the request query
    const schema = z.object({ queryId: z.string().uuid().optional() }).strict()
    const result = schema.safeParse(request.query)
    if (!result.success) {
      response.status(400).json({ success: false, message: result.error.message, errors: result.error.errors })
      return
    }

    // Fetch measurements from the database
    const collection = admin.firestore().collection(MEASUREMENT_COLLECTION)
    const filtered = result.data.queryId ? collection.where('queryId', '==', result.data.queryId) : collection
    const snapshot = await filtered.get()

    // Validate measurements before returning them
    const measurements = snapshot.docs.reduce((acc, cur) => {
      const result = measurementSchema.safeParse(cur.data())
      return result.success ? [ ...acc, result.data ] : acc
    }, [] as Measurement[])

    // Respond with the list of requested measurements
    response.status(200).send({ success: true, measurements })
  } catch (error) {
    console.error(error)
    response.status(500).json({ success: false })
  }
})
