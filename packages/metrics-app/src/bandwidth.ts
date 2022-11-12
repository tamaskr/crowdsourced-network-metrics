// Time the duration of a function's run
async function timedRun(run: () => unknown) {
  const ts0 = Date.now()
  await run()
  const ts1 = Date.now()
  return ts1 - ts0
}

// Measure download bandwidth
export async function measureDownloadBandwidth() {
  const url = 'https://storage.googleapis.com/cmnm-measurement-files/binary25mb'
  const times: number[] = []
  await timedRun(() => fetch(url, { headers: { 'Cache-Content': 'no-store' } }))
  times[0] = await timedRun(() => fetch(url, { headers: { 'Cache-Content': 'no-store' } }))
  times[1] = await timedRun(() => fetch(url, { headers: { 'Cache-Content': 'no-store' } }))
  times[2] = await timedRun(() => fetch(url, { headers: { 'Cache-Content': 'no-store' } }))
  times[3] = await timedRun(() => fetch(url, { headers: { 'Cache-Content': 'no-store' } }))
  times[4] = await timedRun(() => fetch(url, { headers: { 'Cache-Content': 'no-store' } }))
  const ms = times.reduce((acc, cur) => acc + cur, 0) / times.length
  return Math.round(25 * 1024 / (ms / 1000))
}
