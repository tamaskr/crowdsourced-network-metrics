import { Request, Response } from 'firebase-functions'


// Apply all CORS headers and return whether the request is a preflight request
export function cors(request: Request, response: Response): boolean {
  response.setHeader('Access-Control-Allow-Origin', '*')
  response.setHeader('Access-Control-Expose-Headers', '*')
  if (request.method === 'OPTIONS') {
    response.setHeader('Access-Control-Allow-Headers', '*')
    response.setHeader('Access-Control-Allow-Methods', '*')
    response.setHeader('Access-Control-Max-Age', '86400')
    response.setHeader('Content-Length', '0')
    response.status(204).send()
    return true
  }
  return false
}
