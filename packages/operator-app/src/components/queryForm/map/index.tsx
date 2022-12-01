import { Layer, Map, Marker, Source } from 'react-map-gl'
import * as turf from '@turf/turf'
import { theme } from '../../../theme/default'
import Pin from './pin'
import { QueryMapProps } from './types'


export const QueryMap = ({
  latitude,
  longitude,
  range,
  onDrag
}: QueryMapProps) => {
  return (
    <Map
      initialViewState={{
        latitude,
        longitude,
        zoom: 11.5
      }}
      maxZoom={14.5}
      minZoom={9.5}
      maxBounds={[
        [ 24.542633, 60.104611 ],
        [ 25.217454, 60.353529 ]
      ]}
      style={{ width: '100%', height: 700 }}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
    >
      <Marker
        longitude={longitude}
        latitude={latitude}
        anchor="center"
        draggable
        onDrag={e => onDrag(e)}
      >
        <Pin size={24} />
      </Marker>
      <Source
        id="range"
        type="geojson"
        data={turf.circle([ longitude, latitude ], range / 1000)}
      >
        <Layer
          id="range-circle"
          type="fill"
          paint={{
            'fill-color': theme.palette.primary.main,
            'fill-opacity': 0.3
          }}
        />
      </Source>
    </Map>
  )
}
