import { addHours, format } from 'date-fns'
import { useQuery, UseQueryResult } from 'react-query'
import { ReactionsAPIResponse } from '../types/responses'
import { Comment, PatientId, ServiceId } from '../types/types'
import { API_ROOT, get } from './utils'

const useCommentsQuery = ({
  serviceId,
  patientId,
  interactionStart,
}: {
  serviceId: ServiceId
  patientId: PatientId
  interactionStart: Date
}): UseQueryResult<Comment[], unknown> => {
  //https://api.botlab.cl/reactions/167/4369318?start=2023-02-08+09:00:00
  //https://api.botlab.cl/reactions/167/4369318/?start=2023-02-08+06:00:00
  const start = format(addHours(interactionStart, 3), "yyyy-MM-dd'+'HH:mm:ss")
  return useQuery<any, any, any>(
    ['comments', serviceId, patientId, interactionStart],
    async () => {
      const { data }: { data: ReactionsAPIResponse } = await get(
        `${API_ROOT}/reactions/${serviceId}/${patientId}?start=${start}`
      )
      console.log(data)
      return {}
    }
  )
}

export default useCommentsQuery
