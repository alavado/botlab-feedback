import { UseQueryResult, useQuery } from 'react-query'
import useActiveServiceQuery from './useActiveServiceQuery'

const useInteractionsStatisticsQuery = (): UseQueryResult<any, any> => {
  const { data: activeService } = useActiveServiceQuery()

  return useQuery<any, any, any>(['interactions-stats', activeService])
}

export default useInteractionsStatisticsQuery
