import { useQuery, UseQueryResult } from 'react-query'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/ducks'
import { Service } from '../types/types'
import useServicesQuery from './useServicesQuery'

const useActiveServiceQuery = (): UseQueryResult<Service, unknown> => {
  const { data: services } = useServicesQuery()
  const { activeServiceId } = useSelector((state: RootState) => state.answers)

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
