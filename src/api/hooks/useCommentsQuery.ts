import { format, parseISO } from 'date-fns'
import { useQuery, UseQueryResult } from 'react-query'
import { ReactionsAPIResponse } from '../types/responses'
import { Comment, PatientId, ServiceId } from '../types/domain'
import { API_ROOT, get } from './utils'

const useCommentsQuery = ({
  serviceId,
  patientId,
  interactionStart,
}: {
  serviceId?: ServiceId
  patientId?: PatientId
  interactionStart?: Date
}): UseQueryResult<Comment[], unknown> => {
  return useQuery<any, any, any>(
    ['comments', serviceId, patientId, interactionStart],
    async () => {
      if (!serviceId || !patientId || !interactionStart) {
        return []
      }
      const start = format(interactionStart, "yyyy-MM-dd'+'HH:mm:ss")
      const { data }: { data: ReactionsAPIResponse } = await get(
        `${API_ROOT}/reactions/${serviceId}/${patientId}?start=${start}`
      )
      return data.data.map((comment) => ({
        id: comment.id,
        timestamp: parseISO(comment.created_at),
        text: comment.reaction_text,
        emoji: comment.reaction_emoji,
      }))
    },
    { refetchInterval: 10_000 }
  )
}

export default useCommentsQuery
