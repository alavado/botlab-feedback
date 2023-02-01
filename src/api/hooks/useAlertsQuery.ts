import { addDays, format, parseISO } from 'date-fns'
import _ from 'lodash'
import { useQuery, UseQueryResult } from 'react-query'
import { AlertsAPIResponse } from '../types/responses'
import { Alert } from '../types/servicio'
import { get, API_ROOT } from './utils'

const alertsSinceDays = 3

const useAlertsQuery = (): UseQueryResult<Alert[], unknown> => {
  const TODAY = format(new Date(), 'yyyy-MM-dd')
  const daysAgo = format(addDays(new Date(), -alertsSinceDays), 'yyyy-MM-dd')
  const url = `${API_ROOT}/polls/alerts?start_date=${daysAgo}&end_date=${TODAY}`
  return useQuery<Alert[], any, any>(
    'alerts',
    async () => {
      const { data }: { data: AlertsAPIResponse } = await get(url)
      return data.data.map(
        (alert): Alert => ({
          id: alert.id,
          typeId: alert.message,
          solved: alert.dismissed,
          solvedBy: alert.dismissal_by,
          timestamp: parseISO(alert.utc_timestamp),
          serviceId: alert.poll_id,
          patientId: alert.user_id,
          branchId: '',
        })
      )
    },
    {
      refetchInterval: 30_000,
    }
  )
}

export default useAlertsQuery
