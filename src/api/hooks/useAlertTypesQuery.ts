import { useQuery, UseQueryResult } from 'react-query'
import { AlertType } from '../types/servicio'

const useAlertTypesQuery = (): UseQueryResult<AlertType[], unknown> => {
  return useQuery<any, any, any>('alertTypes', async () => {
    return []
  })
}

export default useAlertTypesQuery
