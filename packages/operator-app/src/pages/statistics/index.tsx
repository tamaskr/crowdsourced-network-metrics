import { useQuery } from '@tanstack/react-query'
import { NextPage } from 'next'
import { useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { Typography } from '@mui/material'
import { Layout } from '../../components/layout'
import { formatChartData } from '../../utils/chart'
import { getMeasurements } from '../../services/queries'
import { FormattedChartData } from '../../types/chart'
import { StatisticsChart } from '../../components/charts/statistics'
import { Loading } from '../../components/loading'
import { theme } from '../../theme/default'


const Statistics: NextPage = () => {
  const [ days, setDays ] = useState<number>(7)
  const { isLoading, data } = useQuery(
    [ '/measurements' ],
    () =>
      getMeasurements().catch(() =>
        toast.error('Error while fetching measurement data')),
    {
      cacheTime: 0,
      refetchOnWindowFocus: false
    }
  )

  const chartData: FormattedChartData[] = useMemo(() => {
    if (!data?.data) return []
    return formatChartData(data.data, days)
  }, [ data, days ])

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
            days={days}
            onDaysChange={event => setDays(Number(event.target.value))}
          />
        </>
      )}
    </Layout>
  )
}

export default Statistics
