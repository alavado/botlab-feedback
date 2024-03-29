import _ from 'lodash'
import { useQuery, UseQueryResult } from 'react-query'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/ducks'
import {
  PollsHeadersAPIHeader,
  PollsHeadersAPIResponse,
} from '../types/responses'
import { Service } from '../types/domain'
import { get, API_ROOT } from './utils'

const useServicesQuery = (): UseQueryResult<Service[], unknown> => {
  const url = `${API_ROOT}/polls_headers`
  const { nombreUsuario } = useSelector((state: RootState) => state.login)
  return useQuery<any, any, any>(
    'services',
    async () => {
      const { data }: { data: PollsHeadersAPIResponse } = await get(url)
      return _.sortBy(
        data.data.map((service): Service => {
          const sortedHeaders = sortHeaders(service.headers)
          return {
            id: service.id,
            name: service.name.replace(`${nombreUsuario} `, ''),
            headers: sortedHeaders.map((header) => ({
              name: header.name,
              displayName: header.display_name,
              type: header.type,
              levels: [],
            })),
          }
        }),
        'name'
      )
    },
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  )
}

const sortHeaders = (
  headers: PollsHeadersAPIHeader[]
): PollsHeadersAPIHeader[] => {
  const tagHeaders = headers.filter((h) => !_.isNaN(Number(h.name)))
  const firstTagHeader = tagHeaders.slice(0, 1)
  const otherTagHeaders = tagHeaders.slice(1)
  const nonTagHeaders = headers.filter((h) => _.isNaN(Number(h.name)))
  const patientNameHeader = nonTagHeaders.filter(
    (h) =>
      h.name.includes('patient') ||
      h.name === 'name' ||
      h.name.includes('receiver')
  )
  const dateHeader = nonTagHeaders.filter((h) => h.name.includes('date'))
  const timeHeader = nonTagHeaders.filter((h) => h.name.includes('time'))
  const doctorHeader = nonTagHeaders.filter(
    (h) =>
      h.name.includes('doctor') ||
      h.name.includes('dentist') ||
      h.name.includes('profesional') ||
      h.name.includes('tratante')
  )
  const importantHeaders = [
    ...patientNameHeader,
    ...dateHeader,
    ...timeHeader,
    ...doctorHeader,
  ]
  const otherHeaders = _.difference(nonTagHeaders, importantHeaders)
  return [
    ...firstTagHeader,
    ...importantHeaders,
    ...otherHeaders,
    ...otherTagHeaders,
  ]
}

export default useServicesQuery
