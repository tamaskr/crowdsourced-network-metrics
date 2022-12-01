import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { toast } from 'react-toastify'
import { CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis } from 'recharts'
import { Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import {  getMeasurementsByQueryId } from '../../services/queries'
import { Layout } from '../../components/layout'
import { Loading } from '../../components/loading'
import { Measurement } from '../../types/measurement'


const Details: NextPage = () => {
  const { query: { id: queryId } } = useRouter()

  // Fetch all measurements by query id
  const { isLoading, data } = useQuery<{ ok: boolean; data: Measurement[] }>(
    [ `/getMeasurmentsByqueryId?queryId=${queryId}` ],
    () =>
      getMeasurementsByQueryId(queryId as string).catch(() =>
        toast.error('Error while fetching measurement data')),
    {
      cacheTime: 0,
      refetchOnWindowFocus: false,
      enabled: !!queryId
    }
  )

  // Measurements array
  const measurements = useMemo(() => data?.data ?? [], [ data ])

  // Scatter chart data with bandwidth and latency
  const scatterChartData = useMemo(() => {
    return measurements
      .map(measurement => ({
        bandwidth: measurement.bandwidth ?? 0,
        latency: measurement.latency ?? 0
      }))
      .sort((a, b) => a.bandwidth - b.bandwidth)
      .reverse()
  }, [ measurements ])

  // Pie chart data with signal strength
  const signalStrengthNames = useMemo(() => [ 'None or Unknown', 'Poor', 'Moderate', 'Good', 'Excellent' ], [])
  const pieChartData = useMemo(() => {
    return [
      { name: signalStrengthNames[0], color: '#0088FE', value: measurements.filter(m => !m.signalStrength).length },
      { name: signalStrengthNames[1], color: '#00C49F', value: measurements.filter(m => m.signalStrength === 1).length },
      { name: signalStrengthNames[2], color: '#FFBB28', value: measurements.filter(m => m.signalStrength === 2).length },
      { name: signalStrengthNames[3], color: '#FF8042', value: measurements.filter(m => m.signalStrength === 3).length },
      { name: signalStrengthNames[4], color: '#FF6BD7', value: measurements.filter(m => m.signalStrength === 4).length }
    ].filter(x => x.value)
  }, [ measurements, signalStrengthNames ])

  return (
    <Layout>
      {isLoading ? (
        <Loading />
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <h1>Query {queryId} ({measurements.length})</h1>
          </Grid>
          <Grid item xs={8}>
            <h3>Bandwidth and Latency</h3>
          </Grid>
          <Grid item xs={4}>
            <h3>Signal strength</h3>
          </Grid>
          <Grid item xs={8}>
            <ResponsiveContainer width="100%" height={500}>
              <ScatterChart margin={{ bottom: 24, left: 24, top: 12, right: 24 }}>
                <Legend verticalAlign="top" height={50} />
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="bandwidth" label={{ value: 'Bandwidth (kbps)', position: 'bottom', offset: 10 }} padding="gap" />
                <YAxis dataKey="latency" label={{ value: 'Latency (ms)', angle: -90, position: 'left', offset: 10 }} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter data={scatterChartData} fill="#8884d8" name="Bandwidth (x) to Latency (y)" />
              </ScatterChart>
            </ResponsiveContainer>
          </Grid>
          <Grid item xs={4}>
            <ResponsiveContainer width="100%" height={500}>
              <PieChart margin={{ bottom: 24, left: 24, top: 12, right: 24 }}>
                <Legend verticalAlign="top" height={50} />
                <Pie data={pieChartData} dataKey="value" nameKey="name" labelLine={false} label>
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              </PieChart>
            </ResponsiveContainer>
          </Grid>
          <Grid item xs={12}>
            <h3>Raw data</h3>
          </Grid>
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><b>Index</b></TableCell>
                    <TableCell><b>Bandwidth</b></TableCell>
                    <TableCell><b>Latency</b></TableCell>
                    <TableCell><b>Signal strength</b></TableCell>
                    <TableCell><b>Latitude</b></TableCell>
                    <TableCell><b>Longitude</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {measurements.map((measurement, index) => (
                    <TableRow key={`measurement-${index}`}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{typeof measurement.bandwidth === 'number' ? `${measurement.bandwidth} kbps` : '-'}</TableCell>
                      <TableCell>{typeof measurement.latency === 'number' ? `${measurement.latency} ms` : '-'}</TableCell>
                      <TableCell>{typeof measurement.signalStrength === 'number' ? signalStrengthNames[measurement.signalStrength] : '-'}</TableCell>
                      <TableCell>{measurement.coordinates.latitude}&deg;</TableCell>
                      <TableCell>{measurement.coordinates.longitude}&deg;</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      )}
    </Layout>
  )
}

export default Details