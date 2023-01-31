import { addDays, format } from 'date-fns'
import { useQuery, UseQueryResult } from 'react-query'
import { AnswerMediaAPIResponse } from '../types/responses'
import { get, API_ROOT } from './utils'

const useAlertsQuery = (): UseQueryResult<
  {
    url: string
    contentType: string
  },
  unknown
> => {
  const hoy = format(new Date(), 'yyyy-MM-dd')
  const hace7Dias = format(addDays(new Date(), -3), 'yyyy-MM-dd')
  const url = `${API_ROOT}/polls/alerts?start_date=${hace7Dias}&end_date=${hoy}`
  return useQuery<any, any, any>(
    'alerts',
    async () => {
      const { data }: { data: AnswerMediaAPIResponse } = await get(url)
      return data
    },
    {
      refetchInterval: 30_000,
    }
  )
}

export default useAlertsQuery
