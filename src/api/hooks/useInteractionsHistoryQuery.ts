import { useQuery, UseQueryResult } from 'react-query'
import { PatientId, ServiceId } from '../types/domain'
import { API_ROOT_NEW, get } from './utils'
import { InteractionHistoryResponse } from '../types/responses'

const useInteractionsHistoryQuery = ({
  serviceId,
  patientId,
}: {
  serviceId: ServiceId
  patientId: PatientId
}): UseQueryResult<any, unknown> => {
  const url = `${API_ROOT_NEW}/interactions/${serviceId}/${patientId}`

  return useQuery<any, any, any>(
    ['interactions-history', serviceId, patientId],
    async () => {
      const { data }: { data: InteractionHistoryResponse } = await get(url)
      if (!data) {
        return []
      }
      return data.interactions
    }
  )
}

export default useInteractionsHistoryQuery
