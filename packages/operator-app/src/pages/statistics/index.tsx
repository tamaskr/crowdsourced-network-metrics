import { useQuery } from '@tanstack/react-query'
import { NextPage } from 'next'
import { useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { Typography } from '@mui/material'
import { Layout } from '../../components/layout'
import { formatChartData, getAllUniqueAreas, getAllUniqueCarriers } from '../../utils/chart'
import { getMeasurements } from '../../services/queries'
import { FormattedChartData } from '../../types/chart'
import { StatisticsChart } from '../../components/charts/statistics'
import { Loading } from '../../components/loading'
import { theme } from '../../theme/default'


const Statistics: NextPage = () => {
  const [ selectedArea, setSelectedArea ] = useState<string | null>(null)
  const [ selectedCarrier, setSelectedCarrier ] = useState<string | null>(null)
  const [ selectedTimePeriod, setSelectedTimePeriod ] = useState<number>(7)

  const { isLoading, data } = useQuery(
    [ 'measurements' ],
    () =>
      getMeasurements().catch(() =>
        toast.error('Error while fetching measurement data')),
    {
      cacheTime: 0,
      refetchOnWindowFocus: false
    }
  )

  const chartData: FormattedChartData[] = useMemo(() => {
    if (!data?.measurements) return []
    return formatChartData(data.measurements, selectedTimePeriod, selectedArea)
  }, [ data, selectedTimePeriod, selectedArea ])

  const areas: string[] = useMemo(() => {
    if (!data?.measurements) return []
    return getAllUniqueAreas(data.measurements)
  }, [ data ])

  const carriers: string[] = useMemo(() => {
    if (!data?.measurements) return []
    return getAllUniqueCarriers(data.measurements)
  }, [ data ])

  return (
    <Layout>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <Typography
            variant="h4"
            fontWeight="bold"
            color={theme.palette.primary.main}
            textAlign="center"
          >
            STATISTICS
          </Typography>
          <StatisticsChart
            chartData={chartData}
            selectedArea={selectedArea}
            allAreas={areas}
            handleAreaChange={event => {
              const newArea = event.target.value
              setSelectedArea(newArea === 'all' ? null : newArea)
            }}
            selectedCarrier={selectedCarrier}
            allCarriers={carriers}
            handleCarrierChange={event => {
              const newCarrier = event.target.value
              setSelectedCarrier(newCarrier === 'all' ? null : newCarrier)
            }}
            selectedTimePeriod={selectedTimePeriod}
            handleDaysChange={event =>
              setSelectedTimePeriod(Number(event.target.value))
            }
          />
        </>
      )}
    </Layout>
  )
}

export default Statistics
