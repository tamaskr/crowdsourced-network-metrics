import { QueryDTO } from '../components/queryForm/types'

// Base URL for queries to backend
const baseUrl = 'https://europe-west1-crowdsourced-network-metrics.cloudfunctions.net/'
// Local emulator base URL for development purposes
// const baseUrl = 'http://127.0.0.1:5001/crowdsourced-network-metrics/europe-west1/'

const headers = { 'Content-Type': 'application/json' }

// Report a measurement to the backend to be stored
export const getMeasurements = async () => {
  const response = await fetch(`${baseUrl}measurements`, { method: 'GET' })
  return await response.json()
}

// Get measurements by query id
export const getMeasurementsByQueryId = async (queryId: string) => {
  const response = await fetch(
    `${baseUrl}measurements?queryId=${queryId}`,
    { method: 'GET' }
  )
  return await response.json()
}

// Report a measurement to the backend to be stored
export const postQuery = async ({
  measurements,
  latitude,
  longitude,
  range
}: QueryDTO) => {
  const body = JSON.stringify({ measurements, coordinates: { latitude, longitude }, range })
  const response = await fetch(`${baseUrl}query`, {
    method: 'POST',
    headers,
    body
  })
  return await response.json()
}
