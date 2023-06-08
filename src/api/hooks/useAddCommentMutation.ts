import { format } from 'date-fns'
import { useMutation, UseMutationResult, useQueryClient } from 'react-query'
import { Emoji } from '../../components/Feedback/InteractionDrawer/InteractionComments/InteractionComment/InteractionCommentIcon/emojis'
import { InteractionId } from '../types/domain'
import { API_ROOT, post } from './utils'

const useAddCommentMutation = ({
  interactionId,
  text,
  emoji,
}: {
  interactionId: InteractionId
  text: string
  emoji: Emoji
}): UseMutationResult<unknown, unknown> => {
  const queryClient = useQueryClient()
  const url = `${API_ROOT}/reactions/${interactionId.serviceId}/${interactionId.patientId}`
  return useMutation<any, any, any>(
    async () => {
      const { data } = await post(url, {
        start: format(interactionId.start, 'yyyy-MM-dd HH:mm:ss'),
        text,
        emoji,
      })
      return data
    },
    {
      onMutate: async () => {
        queryClient.cancelQueries('comments')
        const commentsKey = ['comments', interactionId]
        const previousComments = queryClient.getQueryData(
          commentsKey
        ) as Comment[]
        queryClient.setQueryData(commentsKey, [
          ...previousComments,
          {
            id: '-',
            timestamp: new Date(),
            text,
            emoji,
          },
        ])
        // ['comments', serviceId, patientId, interactionStart]
      },
      onError: (err, newComment, context: any) => {},
      onSuccess: (data, variables, context) => {
        console.log({ data, variables, context })
      },
    }
  )
}

export default useAddCommentMutation
