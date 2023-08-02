import { useQuery, UseQueryResult } from 'react-query'
import { InteractionExtraData, InteractionId } from '../types/domain'
import useChatQuery from './useChatQuery'

const useInteractionDataQuery = ({
  interactionId,
}: {
  interactionId?: InteractionId
}): UseQueryResult<InteractionExtraData[], unknown> => {
  const { data } = useChatQuery(interactionId)

  return useQuery<any, any, any>(
    ['interaction-data', interactionId],
    async () => {
      if (!data) {
        return []
      }
      const { currentInteraction } = data
      return currentInteraction?.extraData || []
    },
    { enabled: !!data }
  )
}

export default useInteractionDataQuery
