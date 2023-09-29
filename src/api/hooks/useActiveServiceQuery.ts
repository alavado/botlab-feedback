import { useQuery, UseQueryResult } from 'react-query'
import { Service } from '../types/domain'
import useServicesQuery from './useServicesQuery'
import { useRouteMatch } from 'react-router-dom'

const useActiveServiceQuery = (): UseQueryResult<Service, unknown> => {
  const { data: services } = useServicesQuery()
  const { params }: any = useRouteMatch()
  const activeServiceId = params.serviceId
    ? Number(params.serviceId)
    : undefined

  return useQuery<any, any, any>(
    ['active-service', activeServiceId],
    async () => {
      if (!activeServiceId) {
        return undefined
      }
      return services?.find(
        (service: Service) => service.id === activeServiceId
      )
    },
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      enabled: !!services,
    }
  )
}

export default useActiveServiceQuery
