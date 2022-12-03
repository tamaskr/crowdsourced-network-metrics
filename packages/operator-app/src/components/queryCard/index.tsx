import { Typography } from '@mui/material'
import { Query } from '../../types/measurement'


export const QueryCard = ({ query }: {query: Query}) => {
  return (
    <div>
      <Typography>{query.id}</Typography>
    </div>
  )
}
