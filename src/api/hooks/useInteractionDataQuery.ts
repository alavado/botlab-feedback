import { useQuery, UseQueryResult } from 'react-query'
import { InteractionExtraData, PatientId, ServiceId } from '../types/domain'
import useChatQuery from './useChatQuery'

const useInteractionDataQuery = ({
  serviceId,
  patientId,
  interactionStart,
}: {
  serviceId: ServiceId
  patientId: PatientId
  interactionStart: Date
}): UseQueryResult<InteractionExtraData[], unknown> => {
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
      return currentInteraction.extraData
    },
    { enabled: !!data }
  )
}

export default useInteractionDataQuery
