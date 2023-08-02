import { useQuery, UseQueryResult } from 'react-query'
import {
  Interaction,
  InteractionExtraData,
  Service,
  ServiceHeader,
} from '../types/domain'
import useServicesQuery from './useServicesQuery'
import { useRouteMatch } from 'react-router-dom'
import useInteractionsQuery from './useInteractionsQuery'

const useActiveServiceQuery = (): UseQueryResult<Service, unknown> => {
  const { data: services } = useServicesQuery()
  const { data: interactions } = useInteractionsQuery()
  const { params }: any = useRouteMatch()
  const activeServiceId = params.serviceId
    ? Number(params.serviceId)
    : undefined

  return useQuery<any, any, Service>(
    ['active-service', activeServiceId],
    async () => {
      if (!activeServiceId || !services) {
        return undefined
      }
      const service = services.find(
        (service: Service) => service.id === activeServiceId
      ) as Service
      return {
        ...service,
        headers: getServiceHeadersWithLevels(service.headers, interactions),
      }
    },
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      enabled: !!services,
    }
  )
}

const getServiceHeadersWithLevels = (
  headers: ServiceHeader[],
  interactions?: Interaction[]
): ServiceHeader[] => {
  return headers
  // if (!interactions) {
  //   return headers
  // }
  // const levels = headers.map((header) => ({
  //   ...header,
  //   levels: interactions.map((interaction) => {
  //     const headerValue: InteractionExtraData = interaction.extraData.find(
  //       (p) => p.header === header.name
  //     ) as InteractionExtraData
  //     return headerValue.value
  //   }),
  // }))
  // return levels
}

export default useActiveServiceQuery
