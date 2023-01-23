import { useQuery, UseQueryResult } from 'react-query'
import { AnswerMediaAPIResponse } from '../types/responses'
import { get } from './utils'

const API_ROOT = process.env.REACT_APP_API_ROOT

const useAnswerMediaQuery = (
  answerId: number
): UseQueryResult<
  {
    url: string
    contentType: string
  },
  unknown
> => {
  return useQuery<any, any, any>(['answer_media', answerId], async () => {
    const { data }: { data: AnswerMediaAPIResponse } = await get(
      `${API_ROOT}/answer_media/${answerId}`
    )
    return {
      url: data.data.url,
      contentType: data.data.content_type,
    }
  })
}

export default useAnswerMediaQuery
