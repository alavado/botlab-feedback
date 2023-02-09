import { format } from 'date-fns'
import { useMutation, UseMutationResult, useQueryClient } from 'react-query'
import { Emoji } from '../../components/Feedback/InteractionDrawer/InteractionComments/InteractionCommentIcon/emojis'
import { PatientId, ServiceId } from '../types/types'
import { API_ROOT, post } from './utils'

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
      const { data } = await post(url, {
        start: format(interactionStart, 'yyyy-MM-dd HH:mm:ss'),
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
