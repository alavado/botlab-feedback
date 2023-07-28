import { useQuery, UseQueryResult } from 'react-query'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/ducks'
import { differenceInDays, parse } from 'date-fns'

type PaymentStatus =
  | {
      status: 'EXPIRED'
      sinceDays: number
    }
  | {
      status: 'ALMOST_EXPIRED'
      daysLeft: number
    }
  | { status: 'NOT_EXPIRED' }

const twoHoursInMS = 20_000 //2 * 60 * 60 * 1_000

const useIsClientDebtorQuery = (): UseQueryResult<PaymentStatus> => {
  const { nombreUsuario } = useSelector((state: RootState) => state.login)
  return useQuery<PaymentStatus, any, any>(
    ['isDebtor', nombreUsuario],
    async () => {
      const params = new URLSearchParams([['client', nombreUsuario || '']])
      const data = await axios.get(
        `https://eo4g04esyiiff0d.m.pipedream.net/debtors`,
        {
          params,
        }
      )
      const paymentData = data.data
      if (paymentData.mostExpiredDocumentDate) {
        return {
          status: 'EXPIRED',
          sinceDays: differenceInDays(
            new Date(),
            parse(paymentData.mostExpiredDocumentDate, 'yyyy-MM-dd', new Date())
          ),
        }
      } else if (paymentData.dueDate) {
        return {
          status: 'ALMOST_EXPIRED',
          daysLeft: differenceInDays(
            parse(paymentData.dueDate, 'yyyy-MM-dd', new Date()),
            new Date()
          ),
        }
      } else {
        return { status: 'NOT_EXPIRED' }
      }
    },
    { refetchInterval: twoHoursInMS }
  )
}

export default useIsClientDebtorQuery
