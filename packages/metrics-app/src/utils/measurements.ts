// Measure the run time of the function `run`
async function timedRun(run: () => unknown): Promise<number> {
  const ts0 = Date.now()
  await run()
  const ts1 = Date.now()
  return ts1 - ts0
}

// Measure the download bandwidth in kbps with `count` repetitions
export async function measureDownloadBandwidth(count = 5): Promise<number | null> {
  try {
    const url = 'https://storage.googleapis.com/cmnm-measurement-files/binary25mb'
    const times: number[] = []
    // Perform measurement `count + 1` times
    for (let i = 0; i <= count; i++) {
      times[i] = await timedRun(() => fetch(url, { headers: { 'Cache-Content': 'no-store' } }))
    }
    // Drop the first measurement as establishing the connection and SSL handshake throws off the measurement
    times.shift()
    // Calculate the average kbps
    const ms = times.reduce((acc, cur) => acc + cur, 0) / times.length
    return Math.round(25 * 1024 / (ms / 1000))
  } catch (error) {
    console.error('Failed to measure download bandwidth', error)
    return null
  }
}

// Measure the latency in ms with `count` repetitions
export async function measureLatency(count = 5): Promise<number | null> {
  try {
    const url = 'https://1.1.1.1/cdn-cgi/trace'
    const times: number[] = []
    // Perform measurement `count + 1` times
    for (let i = 0; i <= count; i++) {
      times[i] = await timedRun(() => fetch(url, { headers: { 'Cache-Content': 'no-store' } }))
    }
    // Drop the first measurement as establishing the connection and SSL handshake throws off the measurement
    times.shift()
    // Calculate the average time in ms
    return times.reduce((acc, cur) => acc + cur, 0) / times.length
  } catch (error) {
    console.error('Failed to measure latency', error)
    return null
  }
}

// Measure the signal strength in values from 0 to 4
export async function measureSignalStrength(): Promise<number | null> {
  return null
}
