// Time the run of the function `run` with `repetitions` number of repetitions
export async function timedRun(run: () => unknown, repetitions: number, dropFirst = true): Promise<number> {
  const times: number[] = []
  // Measure the time duration of `repetitions + 1` runs of running `run`
  for (let i = 0; i <= repetitions; i++) {
    const ts0 = Date.now()
    await run()
    const ts1 = Date.now()
    times[i] = ts1 - ts0
  }
  // Drop the first measurement (establishing connection, SSL handshake, etc. usually slows first fetch requests down)
  if (dropFirst) times.shift()
  // Return the calculated average time duration
  return Math.round(times.reduce((acc, cur) => acc + cur, 0) / times.length)
}
