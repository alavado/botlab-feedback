import { format } from 'date-fns'
import { useMutation, UseMutationResult, useQueryClient } from 'react-query'
import { CommentId, PatientId, ServiceId } from '../types/domain'
import { API_ROOT, del } from './utils'

const useDeleteCommentMutation = ({
  serviceId,
  patientId,
  commentId,
}: {
  serviceId: ServiceId
  patientId: PatientId
  commentId: CommentId
}): UseMutationResult<unknown, unknown> => {
  const queryClient = useQueryClient()
  const url = `${API_ROOT}/reactions/${serviceId}/${patientId}`
  return useMutation<any, any, any>(
    async () => {
      const { data } = await del(url, {
        id: commentId,
      })
      return data
    },
    {
      onMutate: async () => {
        // queryClient.cancelQueries('comments')
        // const commentsKey = ['comments', serviceId, patientId, interactionStart]
        // const previousComments = queryClient.getQueryData(
        //   commentsKey
        // ) as Comment[]
        // queryClient.setQueryData(commentsKey, [
        //   ...previousComments,
        //   {
        //     id: '-',
        //     timestamp: new Date(),
        //     text,
        //     emoji,
        //   },
        // ])
        // // ['comments', serviceId, patientId, interactionStart]
      },
      onError: (err, newComment, context: any) => {},
    }
  )
}

export default useDeleteCommentMutation
