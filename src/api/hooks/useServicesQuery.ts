import _ from 'lodash'
import { useQuery, UseQueryResult } from 'react-query'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/ducks'
import { PollsHeadersAPIResponse } from '../types/responses'
import { Service } from '../types/types'
import { get, API_ROOT } from './utils'

const useServicesQuery = (): UseQueryResult<Service[], unknown> => {
  const url = `${API_ROOT}/polls_headers`
  const { nombreUsuario } = useSelector((state: RootState) => state.login)
  return useQuery<any, any, any>(
    'services',
    async () => {
      const { data }: { data: PollsHeadersAPIResponse } = await get(url)
      return _.sortBy(
        data.data.map(
          (service): Service => ({
            id: service.id,
            name: service.name.replace(`${nombreUsuario} `, ''),
            headers: service.headers.map((header) => ({
              name: header.name,
              displayName: header.display_name,
              type: header.type,
            })),
          })
        ),
        'name'
      )
    },
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  )
}

export default useServicesQuery
