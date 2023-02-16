import { useQuery, UseQueryResult } from 'react-query'
import { InteractionMeta, PatientId, ServiceId } from '../types/types'
import useChatQuery from './useChatQuery'

const useInteractionDataQuery = ({
  serviceId,
  patientId,
  interactionStart,
}: {
  serviceId: ServiceId
  patientId: PatientId
  interactionStart: Date
}): UseQueryResult<InteractionMeta[], unknown> => {
  const { data } = useChatQuery({
    serviceId,
    patientId,
    start: interactionStart,
  })

  return useQuery<any, any, any>(
    ['interaction-data', serviceId, patientId, interactionStart],
    async () => {
      if (!data) {
        return []
      }
      const { currentInteraction } = data
      return currentInteraction.meta
    },
    { enabled: !!data }
  )
}

export default useInteractionDataQuery
