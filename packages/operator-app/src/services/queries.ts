import { QueryDTO } from '../components/queryForm/types'

// Base URL for all endpoints
const baseUrl = 'https://europe-west1-crowdsourced-network-metrics.cloudfunctions.net/'

// Header data for endpoints
const headers = { 'Content-Type': 'application/json' }

// Get all measurements
export const getMeasurements = async () => {
  const response = await fetch(`${baseUrl}measurements`, { method: 'GET' })
  return await response.json()
}

// Get all queries
export const getQueries = async () => {
  const response = await fetch(`${baseUrl}query`, { method: 'GET' })
  return await response.json()
}

// Get measurements by query id
export const getMeasurementsByQueryId = async (queryId: string) => {
  const response = await fetch(`${baseUrl}measurements?queryId=${queryId}`, {
    method: 'GET'
  })
  return await response.json()
}

// Send a query request to the backend endpoint
export const postQuery = async ({
  measurements,
  latitude,
  longitude,
  range
}: QueryDTO) => {
  // Format request body before calling the endpoint
  const body = JSON.stringify({
    measurements,
    coordinates: { latitude, longitude },
    range
  })
  const response = await fetch(`${baseUrl}query`, {
    method: 'POST',
    headers,
    body
  })
  return await response.json()
}
