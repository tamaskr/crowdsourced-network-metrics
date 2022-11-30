import { MeasurementType } from '../types/measurement'


// Base URL for queries to backend
const baseUrl = 'https://europe-west1-crowdsourced-network-metrics.cloudfunctions.net/'
// Local emulator base URL for development purposes
// const baseUrl = 'http://127.0.0.1:5001/crowdsourced-network-metrics/europe-west1/'

const headers = { 'Content-Type': 'application/json' }

// Report a measurement to the backend to be stored
export async function getMeasurements() {
  const response = await fetch(`${baseUrl}measurements`, { method: 'GET' })
  return await response.json()
}

// Get measurements by query id
export async function getMeasurementsByQueryId(queryId: string) {
  const response = await fetch(`${baseUrl}getMeasurmentsByQueryId?queryId=${queryId}`, { method: 'GET' })
  return await response.json()
}

// Report a measurement to the backend to be stored
export async function postQuery(measurements: MeasurementType[]) {
  const body = JSON.stringify({ measurements })
  const response = await fetch(`${baseUrl}query`, { method: 'POST', headers, body })
  return await response.json()
}
