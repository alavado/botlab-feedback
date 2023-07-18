import { useQuery, UseQueryResult } from 'react-query'
import axios from 'axios'

const useDebtorsQuery = (): UseQueryResult<unknown> => {
  return useQuery<any, any, any>(
    ['debtors'],
    async () => {
      const data = await axios.get(
        `https://api.duemint.com/v1/getDocuments?status=2`,
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_DUEMINT_TOKEN}`,
            Accept: 'application/json',
          },
        }
      )
      console.log(data)
      return null
    }
    //{ refetchInterval: 2 * 60 * 60 * 1_000 }
  )
}

export default useDebtorsQuery
