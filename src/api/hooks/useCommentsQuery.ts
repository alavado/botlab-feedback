import { format, parseISO } from 'date-fns'
import { useQuery, UseQueryResult } from 'react-query'
import { ReactionsAPIResponse } from '../types/responses'
import { Comment, InteractionId } from '../types/domain'
import { API_ROOT, get } from './utils'

const useCommentsQuery = ({
  interactionId,
}: {
  interactionId?: InteractionId
}): UseQueryResult<Comment[], unknown> => {
  return useQuery<any, any, any>(
    ['comments', interactionId],
    async () => {
      if (!interactionId) {
        return []
      }
      const { serviceId, patientId, start } = interactionId
      const startParam = format(start, "yyyy-MM-dd'+'HH:mm:ss")
      const { data }: { data: ReactionsAPIResponse } = await get(
        `${API_ROOT}/reactions/${serviceId}/${patientId}?start=${startParam}`
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
