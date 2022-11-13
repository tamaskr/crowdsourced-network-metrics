// Logger with tag and timestamp, wrapping the built-in console API
export const logger = {
  log(tag: string, ...args: unknown[]) {
    console.log(`[${tag} - ${new Date().toLocaleTimeString()}]`, ...args)
  },
  warn(tag: string, ...args: unknown[]) {
    console.warn(`[${tag} - ${new Date().toLocaleTimeString()}]`, ...args)
  },
  error(tag: string, ...args: unknown[]) {
    console.error(`[${tag} - ${new Date().toLocaleTimeString()}]`, ...args)
  }
}
