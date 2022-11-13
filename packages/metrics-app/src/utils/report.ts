export interface Report {
  id: string
  queryId: string
  coordinates: {
    latitude: number
    longitude: number
  }
  bandwidth?: number | null
  latency?: number | null
  signalStrength?: number | null
}

export type ReportWithoutId = Omit<Report, 'id'>

// Send a measurement report to the backend
export async function report(data: ReportWithoutId): Promise<boolean> {
  try {
    const url = 'https://europe-west1-crowdsourced-network-metrics.cloudfunctions.net/report'
    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(data)
    const response = await fetch(url, { method: 'POST', headers, body })
    const responseData = await response.json()
    if (response.status !== 200) throw responseData.error
    return true
  } catch (error) {
    console.error('Reporting measurements failed', error)
    return false
  }
}
