import { MarkerDragEvent } from 'react-map-gl'


export interface QueryMapProps {
  latitude: number
  longitude: number
  range: number
  onDrag: ({ lngLat: { lng, lat } }: MarkerDragEvent) => void
}
