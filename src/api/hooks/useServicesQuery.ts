import { useQuery, UseQueryResult } from 'react-query'
import { PollsHeadersAPIResponse } from '../types/responses'
import { Service } from '../types/servicio'
import { get, API_ROOT } from './utils'

const useServicesQuery = (): UseQueryResult<Service[], unknown> => {
  const url = `${API_ROOT}/polls_headers`
  return useQuery<any, any, any>(
    'services',
    async () => {
      const { data }: { data: PollsHeadersAPIResponse } = await get(url)
      return data.data.map(
        (service): Service => ({
          id: service.id,
          name: service.name,
          headers: service.headers.map((header) => ({
            name: header.name,
            displayName: header.display_name,
            type: header.type,
          })),
        })
      )
    },
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  )
}

export default useServicesQuery
