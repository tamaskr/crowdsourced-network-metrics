import { NextPage } from 'next'
import { CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis } from 'recharts'
import { Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { Layout } from '../../components/layout'
import { Measurement } from '../../types/measurement'


const queryId = 'b1430c61-af21-4b09-b7be-c1a59e3de89f'
const all: Measurement[] = [{ 'bandwidth': 27001, 'signalStrength': 2, 'queryId': 'b1430c61-af21-4b09-b7be-c1a59e3de89f', 'coordinates': { 'latitude': 60.295589, 'longitude': 24.725368 }, 'id': '28f43268-efb6-438b-97d2-2980c05a16f8', 'latency': 25, 'timestamp': 1669704636739 }, { 'timestamp': 1669612338476, 'latency': 39, 'queryId': '28f18a13-5a32-4170-bc54-e31d8cfb7fc1', 'bandwidth': 12993, 'id': '3e3c2c8b-047a-47cb-9b4f-b88a66f0d598', 'coordinates': { 'latitude': 60.162537, 'longitude': 25.013731 }, 'signalStrength': 0 }, { 'signalStrength': 1, 'queryId': '28f18a13-5a32-4170-bc54-e31d8cfb7fc1', 'id': '43a921a4-3b36-40d2-8623-6ffd0517bfa1', 'timestamp': 1669655319611, 'coordinates': { 'longitude': 25.103402, 'latitude': 60.270806 }, 'bandwidth': 23199, 'latency': 2 }, { 'coordinates': { 'latitude': 60.283334, 'longitude': 25.15985 }, 'id': '4bc2a379-2557-424b-a12c-547b3cac2c2b', 'queryId': 'b1430c61-af21-4b09-b7be-c1a59e3de89f', 'signalStrength': 3, 'bandwidth': 11548, 'latency': 63, 'timestamp': 1669257959947 }, { 'latency': 44, 'queryId': '75f8ed22-684f-4e4b-b68a-2b8cd7e0d63f', 'timestamp': 1669379829058, 'signalStrength': 1, 'bandwidth': 11799, 'coordinates': { 'longitude': 24.716427, 'latitude': 60.232924 }, 'id': '6598e3ad-254c-4207-9076-8993fe463f35' }, { 'signalStrength': 1, 'id': '7162a312-d7f6-4d87-bf7a-be00a0b5e31c', 'queryId': 'b1430c61-af21-4b09-b7be-c1a59e3de89f', 'timestamp': 1669677635853, 'bandwidth': 11947, 'latency': 59, 'coordinates': { 'longitude': 24.935165, 'latitude': 60.156369 } }, { 'id': '78d163ab-bec3-43e6-94d6-e3a725c6cf93', 'coordinates': { 'longitude': 25.086099, 'latitude': 60.220798 }, 'queryId': 'b1430c61-af21-4b09-b7be-c1a59e3de89f', 'bandwidth': 13160, 'latency': 98, 'timestamp': 1669518483118, 'signalStrength': 3 }, { 'latency': 2, 'signalStrength': 3, 'coordinates': { 'longitude': 25.107247, 'latitude': 60.265912 }, 'bandwidth': 1648, 'id': '7b2a2336-d2a6-4431-a598-6d381bd8145e', 'timestamp': 1669672006995, 'queryId': 'b1430c61-af21-4b09-b7be-c1a59e3de89f' }, { 'timestamp': 1669615046742, 'latency': 75, 'coordinates': { 'longitude': 25.141349, 'latitude': 60.226485 }, 'queryId': '75f8ed22-684f-4e4b-b68a-2b8cd7e0d63f', 'signalStrength': 4, 'bandwidth': 23343, 'id': '82f982cf-2f27-4abb-83b3-c464f8b96f72' }, { 'bandwidth': 16118, 'id': '87177aa8-c91b-4786-a905-3cb807db783f', 'signalStrength': 3, 'queryId': 'b1430c61-af21-4b09-b7be-c1a59e3de89f', 'timestamp': 1669192641916, 'coordinates': { 'longitude': 25.166973, 'latitude': 60.289177 }, 'latency': 18 }, { 'id': 'b6176004-ffac-4112-a1a8-4953307b849d', 'latency': 42, 'timestamp': 1669138987163, 'queryId': 'b1430c61-af21-4b09-b7be-c1a59e3de89f', 'coordinates': { 'latitude': 60.298114, 'longitude': 24.818353 }, 'signalStrength': 1, 'bandwidth': 1369 }, { 'coordinates': { 'latitude': 60.180384, 'longitude': 24.615467 }, 'bandwidth': 1404, 'latency': 0, 'signalStrength': 2, 'timestamp': 1669712696836, 'id': 'bae5dea0-541e-4ed6-8805-54c72f6a4eae', 'queryId': 'b1430c61-af21-4b09-b7be-c1a59e3de89f' }, { 'latency': 11, 'coordinates': { 'longitude': 24.909935, 'latitude': 60.299015 }, 'signalStrength': 1, 'id': 'da85aeb6-9af8-4f51-b351-c35c9d583523', 'queryId': 'b1430c61-af21-4b09-b7be-c1a59e3de89f', 'bandwidth': 41700, 'timestamp': 1669682451307 }, { 'coordinates': { 'latitude': 60.151912, 'longitude': 24.852533 }, 'id': 'e6fc9ddb-e3aa-4b53-b1a4-fd0faf2128a8', 'signalStrength': 0, 'latency': 36, 'bandwidth': 17867, 'queryId': 'b1430c61-af21-4b09-b7be-c1a59e3de89f', 'timestamp': 1669535292960 }]
const measurements = all.filter(x => x.queryId === queryId)

const QueryResult: NextPage = () => {

  // Scatter chart data with bandwidth and latency
  const scatterChartData = measurements
    .map(measurement => ({
      bandwidth: measurement.bandwidth ?? 0,
      latency: measurement.latency ?? 0
    }))
    .sort((a, b) => a.bandwidth - b.bandwidth)
    .reverse()

  // Pie chart data with signal strength
  const signalStrengthNames = [ 'None or Unknown', 'Poor', 'Moderate', 'Good', 'Excellent' ]
  const pieChartData = [
    { name: signalStrengthNames[0], color: '#0088FE', value: measurements.filter(m => !m.signalStrength).length },
    { name: signalStrengthNames[1], color: '#00C49F', value: measurements.filter(m => m.signalStrength === 1).length },
    { name: signalStrengthNames[2], color: '#FFBB28', value: measurements.filter(m => m.signalStrength === 2).length },
    { name: signalStrengthNames[3], color: '#FF8042', value: measurements.filter(m => m.signalStrength === 3).length },
    { name: signalStrengthNames[4], color: '#FF6BD7', value: measurements.filter(m => m.signalStrength === 4).length }
  ].filter(x => x.value)

  return (
    <Layout>
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
    </Layout>
  )
}

export default QueryResult
