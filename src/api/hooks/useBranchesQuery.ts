import { useQuery, UseQueryResult } from 'react-query'
import store from '../../redux/store'
import { Branch } from '../types/servicio'

const useBranchesQuery = (): UseQueryResult<Branch[], unknown> => {
  return useQuery<any, any, any>(
    'branches',
    async () => {
      const loginSlice: any = store.getState().login
      return loginSlice.sucursales
    },
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  )
}

export default useBranchesQuery
