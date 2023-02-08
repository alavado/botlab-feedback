import _ from 'lodash'
import { useQuery, UseQueryResult } from 'react-query'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/ducks'
import { Branch } from '../types/types'

const useBranchesQuery = (): UseQueryResult<Branch[], unknown> => {
  const { sucursales } = useSelector((state: RootState) => state.login)
  return useQuery<any, any, any>('branches', async () => {
    const branchesNames = _.uniq(
      (sucursales as string[]).map((s: any) => s.name)
    )
    return _.sortBy(
      branchesNames.map((name: any) => ({
        id: name,
        name,
      })),
      'name'
    )
  })
}

export default useBranchesQuery
