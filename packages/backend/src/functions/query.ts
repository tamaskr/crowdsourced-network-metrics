import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as uuid from 'uuid'
import { QUERY_COLLECTION, QUERY_TOPIC, REGION } from '../utils/constants'
import { cors } from '../utils/cors'
import { querySchema } from '../utils/schemas'
import { FCMDataMessage, Query } from '../types/types'


// Create and read queries
export const query = functions.region(REGION).https.onRequest(async (request, response) => {
  try {
    // Handle CORS
    const isPreflight = cors(request, response)
    if (isPreflight) return

    // Handle GET requests - fetch and return all queries
    if (request.method === 'GET') {
      // Fetch queries from the database
      const snapshot = await admin.firestore().collection(QUERY_COLLECTION).get()

      // Validate queries before returning them
      const queries = snapshot.docs.reduce((acc, cur) => {
        const result = querySchema.safeParse(cur.data())
        return result.success ? [ ...acc, result.data ] : acc
      }, [] as Query[])

      // Respond with the list of queries
      response.status(200).json({ success: true, queries })
      return
    }

    // Allow only POST requests to pass further
    if (request.method !== 'POST') {
      response.status(405).header('Allow', 'GET, POST').json({ success: false })
      return
    }

    // Validate the request body
    const schema = querySchema.pick({ measurements: true, coordinates: true, range: true })
    const result = schema.safeParse(request.body)
    if (!result.success) {
      response.status(400).json({ success: false, message: result.error.message, errors: result.error.errors })
      return
    }

    // Construct query
    const query: Query = { id: uuid.v4(), timestamp: Date.now(), responseCount: 0, ...result.data }

    // Save the query to the database
    await admin.firestore().collection(QUERY_COLLECTION).doc(query.id).set(query)

    // Transform the query to be a record of string keys and string values
    const data: FCMDataMessage = {
      id: query.id,
      measurements: query.measurements.join(','),
      latitude: query.coordinates.latitude.toString(),
      longitude: query.coordinates.longitude.toString(),
      range: query.range.toString()
    }

    // Send FCM message to all devices that are subscribed to the query topic
    await admin.messaging().sendToTopic(QUERY_TOPIC, { data }, {
      // Required for background messages on iOS
      contentAvailable: true,
      // Required for background messages on Android
      priority: 'high'
    })

    // Respond with the id of the created query
    response.status(200).json({ success: true, query })
  } catch (error) {
    console.error(error)
    response.status(500).json({ success: false })
  }
})
