import { useQuery, UseQueryResult } from 'react-query'
import { AnswerMediaAPIResponse } from '../types/responses'
import { API_ROOT, get } from './utils'

const useAnswerMediaQuery = (
  answerId: number
): UseQueryResult<
  {
    url: string
    contentType: string
  },
  unknown
> => {
  return useQuery<any, any, any>(
    ['answer_media', answerId],
    async () => {
      const { data }: { data: AnswerMediaAPIResponse } = await get(
        `${API_ROOT}/answer_media/${answerId}`
      )
      return {
        url: data.data.url,
        contentType: data.data.content_type,
      }
    },
    {
      refetchOnWindowFocus: false,
    }
  )
}

export default useAnswerMediaQuery
