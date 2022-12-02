import { getCurrentCoordinates } from '../services/devicelocation'

const GEOCODE_API_KEY = 'bdc_ec1c6c097de9484c8db9633444fb8cca'

export async function getAddress(): Promise<any> {
  const coordinates = await getCurrentCoordinates()
  const url = `https://api.bigdatacloud.net/data/reverse-geocode?latitude=${coordinates?.latitude}&longitude=${coordinates?.longitude}&localityLanguage=en&key=${GEOCODE_API_KEY}`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('Failed to fetch address!')
  }
  const data = await response.json()
  // console.log('data of address', JSON.stringify(data))
  const address = data.locality
  console.log('data of local address:', address)
  return address
}
