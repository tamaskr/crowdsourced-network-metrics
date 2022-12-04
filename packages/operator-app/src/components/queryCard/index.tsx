import { Typography } from '@mui/material'
import { format } from 'date-fns'
import { Map, Layer, Source } from 'react-map-gl'
import * as turf from '@turf/turf'
import { theme } from '../../theme/default'
import { Query } from '../../types/measurement'
import { measurementOptions } from '../../utils/measurement'
import {
  CardContainer,
  ContentContainer,
  FloatingCountContainer,
  MapContainer,
  MeasurementCard,
  MeasurementCardsContainer
} from './styles'


export const QueryCard = ({
  query: {
    id,
    measurements,
    coordinates: { latitude, longitude },
    range,
    responseCount,
    timestamp
  }
}: {
  query: Query
}) => {
  /*
    Calculates map zoom based on the given range parameter
     - if range is 15 kilometers (max), then the map zoom should be 8
     - if the range is 0, map zoom should be 11
     - anything in between those values should have the proportionate value between 8 and 11
  */
  const mapZoom = 11 - range / 5
  return (
    <CardContainer>
      <ContentContainer>
        <Typography
          variant="h5"
          fontWeight="bold"
          color={theme.palette.primary.dark}
        >
          {format(new Date(timestamp), 'yyyy MMMM do pp')}
        </Typography>
        <Typography variant="body1" color={theme.palette.primary.dark}>
          ID: {id}
        </Typography>
        <FloatingCountContainer>
          <Typography
            variant="h5"
            fontWeight="bold"
            color={theme.palette.common.white}
            display="inline"
            sx={{ paddingRight: theme.spacing(0.8) }}
          >
            {responseCount}
          </Typography>
          <Typography
            variant="h6"
            color={theme.palette.common.white}
            display="inline"
          >
            {responseCount === 1 ? 'response' : 'responses'}
          </Typography>
        </FloatingCountContainer>
        <MeasurementCardsContainer>
          {measurements.map(measurement => {
            return (
              <MeasurementCard key={measurement}>
                <Typography variant="body1" color={theme.palette.common.white}>
                  {measurementOptions.find(element => element.value === measurement)?.label ?? '-'}
                </Typography>
              </MeasurementCard>
            )
          })}
        </MeasurementCardsContainer>
      </ContentContainer>
      <MapContainer>
        <Map
          initialViewState={{
            latitude,
            longitude,
            zoom: mapZoom
          }}
          scrollZoom={false}
          boxZoom={false}
          dragRotate={false}
          dragPan={false}
          keyboard={false}
          doubleClickZoom={false}
          touchZoomRotate={false}
          touchPitch={false}
          mapStyle="mapbox://styles/mapbox/streets-v9"
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
          cursor="pointer"
        >
          <Source
            id="range"
            type="geojson"
            data={turf.circle([ longitude, latitude ], range)}
          >
            <Layer
              id="range-circle"
              type="fill"
              paint={{
                'fill-color': theme.palette.primary.main,
                'fill-opacity': 0.4
              }}
            />
          </Source>
        </Map>
      </MapContainer>
    </CardContainer>
  )
}
