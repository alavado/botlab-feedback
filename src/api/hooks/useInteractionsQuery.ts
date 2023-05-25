import { UseQueryResult, useQuery } from 'react-query'
import { Interaction, ServiceId } from '../types/types'
import { AnswersAPIResponse } from '../types/responses'
import { API_ROOT, get } from './utils'
import { format, parseISO } from 'date-fns'

const useInteractionsQuery = ({
  serviceId,
  startDate,
  endDate,
}: {
  serviceId: ServiceId | undefined
  startDate: Date
  endDate: Date
}): UseQueryResult<Interaction[], unknown> => {
  const startDateString = format(startDate, 'yyyy-MM-dd')
  const endDateString = format(endDate, 'yyyy-MM-dd')
  const url = `${API_ROOT}/answers/${serviceId}?fecha_inicio=${startDateString}%2000%3A00&fecha_termino=${endDateString}%2023%3A59`

  return useQuery<Interaction[], any, any>(
    ['interactions', serviceId, startDateString, endDateString],
    async () => {
      if (!serviceId) {
        return []
      }
      const { data }: { data: AnswersAPIResponse } = await get(url)
      return data.data.map(
        (answer: AnswersAPIResponse['data'][number]): Interaction => {
          return {
            appointments: [],
            meta: [],
            patientId: answer.user_id,
            serviceId: serviceId,
            start: parseISO(answer.start),
          }
        }
      )
    },
    {
      refetchOnWindowFocus: false,
      refetchInterval: 120_000,
    }
  )
}

export default useInteractionsQuery
