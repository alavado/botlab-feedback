import { useQuery, UseQueryResult } from 'react-query'
import { PatientId, ServiceId } from '../types/domain'
import { API_ROOT, get } from './utils'

const useInteractionsHistoryQuery = ({
  serviceId,
  patientId,
}: {
  serviceId: ServiceId
  patientId: PatientId
}): UseQueryResult<any, unknown> => {
  const url = `${API_ROOT}/interactions/${serviceId}/${patientId}`

  return useQuery<any, any, any>(
    ['interactions-history', serviceId, patientId],
    async () => {
      const data = get(url)
      if (!data) {
        return []
      }
      console.log(data)
      return []
    }
  )
}

export default useInteractionsHistoryQuery
