import { useMutation, UseMutationResult, useQueryClient } from 'react-query'
import { Emoji } from '../../components/Feedback/InteractionDrawer/InteractionComments/InteractionCommentIcon/emojis'
import { PatientId, ServiceId } from '../types/types'
import { patch, API_ROOT } from './utils'

const useAddCommentMutation = ({
  serviceId,
  patientId,
  interactionStart,
  text,
  emoji,
}: {
  serviceId: ServiceId
  patientId: PatientId
  interactionStart: Date
  text: string
  emoji: Emoji
}): UseMutationResult<unknown, unknown> => {
  const queryClient = useQueryClient()
  const url = `${API_ROOT}/reactions/${serviceId}/${patientId}`
  return useMutation<any, any, any>(
    async () => {
      const { data } = await patch(url, {
        start: interactionStart,
        text,
        emoji,
      })
      return data
    },
    {
      onMutate: async () => {
        // refactorear esto
      },
      onError: (err, newComment, context: any) => {},
    }
  )
}

export default useAddCommentMutation
