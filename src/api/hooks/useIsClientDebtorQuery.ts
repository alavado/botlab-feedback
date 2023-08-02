import { useQuery, UseQueryResult } from 'react-query'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/ducks'

type DebtData = {
  isDebtor: boolean
  dueDate: Date
}

const twoHoursInMS = 2 * 60 * 60 * 1_000

const useIsClientDebtorQuery = (): UseQueryResult<DebtData> => {
  const { nombreUsuario } = useSelector((state: RootState) => state.login)
  return useQuery<DebtData, any, any>(
    ['isDebtor', nombreUsuario],
    async () => {
      const params = new URLSearchParams([['client', nombreUsuario || '']])
      const data = await axios.get(`https://eo4g04esyiiff0d.m.pipedream.net`, {
        params,
      })
      console.log({ data })
      return {
        isDebtor: true,
        dueDate: new Date(),
      }
    },
    { refetchInterval: twoHoursInMS }
  )
}

export default useIsClientDebtorQuery
