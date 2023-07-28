import { useQuery, UseQueryResult } from 'react-query'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/ducks'
import { differenceInDays, format, parse } from 'date-fns'
import { es } from 'date-fns/locale'

const twoHoursInMS = 2 * 60 * 60 * 1_000
const daysForAlmostExpiredStatus = 7

type PaymentStatus =
  | {
      status: 'EXPIRED'
      documentIssueMonth: string
    }
  | {
      status: 'ALMOST_EXPIRED'
      documentIssueMonth: string
      daysLeft: number
    }
  | { status: 'NOT_EXPIRED' }

const useIsClientDebtorQuery = (): UseQueryResult<PaymentStatus> => {
  const { nombreUsuario } = useSelector((state: RootState) => state.login)
  return useQuery<PaymentStatus, any, any>(
    ['isDebtor', nombreUsuario],
    async () => {
      const params = new URLSearchParams([['client', nombreUsuario || '']])
      const {
        data: {
          mostExpiredDocumentIssueDate,
          nearestDueDate,
          nearestDueDateIssueDate,
        },
      } = await axios.get(`https://eo4g04esyiiff0d.m.pipedream.net/debtors`, {
        params,
      })
      if (mostExpiredDocumentIssueDate) {
        const issueMonth = formatDocumentIssueMonth(
          mostExpiredDocumentIssueDate
        )
        return {
          status: 'EXPIRED',
          documentIssueMonth: issueMonth,
        }
      }
      if (nearestDueDate) {
        const daysLeft = differenceInDays(
          parse(nearestDueDate, 'yyyy-MM-dd', new Date()),
          new Date()
        )
        if (daysLeft <= daysForAlmostExpiredStatus) {
          const issueMonth = formatDocumentIssueMonth(nearestDueDateIssueDate)
          return {
            status: 'ALMOST_EXPIRED',
            documentIssueMonth: issueMonth,
            daysLeft,
          }
        }
      }
      return { status: 'NOT_EXPIRED' }
    },
    { refetchInterval: twoHoursInMS, refetchOnWindowFocus: true }
  )
}

const formatDocumentIssueMonth = (dateISO: string) =>
  format(parse(dateISO, 'yyyy-MM-dd', new Date()), 'MMMM', { locale: es })

export default useIsClientDebtorQuery
