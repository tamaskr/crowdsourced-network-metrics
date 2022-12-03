import { getCurrentCoordinates } from '../services/devicelocation'


const BIGDATACLOUD_API_KEY = 'bdc_ec1c6c097de9484c8db9633444fb8cca'

export async function getAddress(): Promise<string | null> {
  const coordinates = await getCurrentCoordinates()
  const url = `https://api.bigdatacloud.net/data/reverse-geocode?latitude=${coordinates?.latitude}&longitude=${coordinates?.longitude}&localityLanguage=en&key=${BIGDATACLOUD_API_KEY}`
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('Failed to fetch address!')
  }

  const data = await response.json()
  const area = data.locality
  console.log('area of device_location:', area)
  return area
}
