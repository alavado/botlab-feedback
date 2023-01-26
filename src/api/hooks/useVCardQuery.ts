import axios from 'axios'
import { useQuery, UseQueryResult } from 'react-query'
import useAnswerMediaQuery from './useAnswerMediaQuery'

interface VCardData {
  phone?: string
  name?: string
}

const useVCardQuery = (answerId: number): UseQueryResult<any, VCardData> => {
  const { data } = useAnswerMediaQuery(answerId)
  return useQuery(['vcard', answerId], () => axios.get(data?.url as string), {
    enabled: !!data?.url,
    refetchOnWindowFocus: false,
    select: (data) => processVCard(data.data),
  })
}

const processVCard = (data: string): VCardData => {
  const parts = data.split('\r\n').reduce((obj: any, line: any) => {
    const [prop, value] = line.split(':')
    return { ...obj, [prop]: value }
  }, {})
  const VCard: VCardData = {}
  Object.keys(parts).forEach((prop) => {
    if (prop.startsWith('TEL')) {
      VCard.phone = parts[prop]
    } else if (prop === 'FN') {
      VCard.name = parts[prop]
    }
  })
  return VCard
}

export default useVCardQuery
