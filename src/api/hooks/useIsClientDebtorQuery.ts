import { useQuery, UseQueryResult } from 'react-query'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/ducks'
import { addMonths, differenceInDays, format, parse } from 'date-fns'
import { es } from 'date-fns/locale'

const twoHoursInMS = 2 * 60 * 60 * 1_000
const daysForAlmostExpiredStatus = 7

type PaymentStatus =
  | {
      status: 'EXPIRED'
      documentServiceMonth: string
    }
  | {
      status: 'ALMOST_EXPIRED'
      documentServiceMonth: string
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
      } = await axios.get(
        process.env.REACT_APP_PIPEDREAM_DUEMINT_WORKFLOW_URL as string,
        {
          params,
        }
      )
      if (mostExpiredDocumentIssueDate) {
        const documentServiceMonth = formatDocumentIssueMonth(
          mostExpiredDocumentIssueDate
        )
        return {
          status: 'EXPIRED',
          documentServiceMonth,
        }
      }
      if (nearestDueDate) {
        const daysLeft =
          differenceInDays(
            parse(nearestDueDate, 'yyyy-MM-dd', new Date()),
            new Date()
          ) + 1
        if (daysLeft <= daysForAlmostExpiredStatus) {
          const documentServiceMonth = formatDocumentIssueMonth(
            nearestDueDateIssueDate
          )
          return {
            status: 'ALMOST_EXPIRED',
            documentServiceMonth,
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
  format(addMonths(parse(dateISO, 'yyyy-MM-dd', new Date()), -1), 'MMMM', {
    locale: es,
  })

export default useIsClientDebtorQuery
