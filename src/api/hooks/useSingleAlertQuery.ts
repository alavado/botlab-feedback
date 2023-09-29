import { useQuery, UseQueryResult } from 'react-query'
import { ChatAPIResponse } from '../types/responses'
import { get, API_ROOT } from './utils'

const useSingleAlertQuery = (
  serviceId: string,
  patientId: string,
  alertId: string
): UseQueryResult<any, any> => {
  return useQuery<any, any, any>(
    ['alert', alertId],
    async () => {
      const { data: alertData } = await get(`${API_ROOT}/alerts/${alertId}`)
      const { data: chatData }: { data: ChatAPIResponse } = await get(
        `${API_ROOT}/chat/${serviceId}/${patientId}`
      )
      return {
        alertData,
        chatData,
      }
    },
    {
      refetchOnWindowFocus: false,
    }
  )
}

export default useSingleAlertQuery
