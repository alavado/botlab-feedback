import axios from 'axios'
import {
  addDays,
  differenceInDays,
  format,
  isSameDay,
  parseISO,
} from 'date-fns'
import { useQuery, UseQueryResult } from 'react-query'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/ducks'
import _ from 'lodash'

export type DashboardDayCount = { date: Date; total: number; answered: number }

const useDashboardDataQuery = ({
  startDate,
  endDate,
}: {
  startDate: Date
  endDate: Date
}): UseQueryResult<any, DashboardDayCount[]> => {
  const start = format(startDate, 'yyyy-MM-dd')
  const end = format(endDate, 'yyyy-MM-dd')
  const { idCliente } = useSelector((state: RootState) => state.login)

  return useQuery<any, any, any>(
    ['dashboard', start, end],
    async () => {
      const { data } = await axios.get(
        `https://dashboard-api-ysuyrps2hq-tl.a.run.app/client/${idCliente}/metrics2?start_date=${start}&end_date=${end}`
      )
      if (_.isEmpty(data.citas)) {
        return []
      }
      const counts: DashboardDayCount[] = data.citas.map((d: any) => ({
          date: parseISO(d.fecha_cita),
          total: d.carga,
          answered: d.respuesta,
        })
      )

      let currentDate = startDate
      const maxDate = endDate

      while (differenceInDays(maxDate, currentDate) >= 0) {
        const dateExists = counts.some((c: DashboardDayCount) =>
          isSameDay(c.date, currentDate)
        )
        if (!dateExists) {
          counts.push({
            date: currentDate,
            total: 0,
            answered: 0,
          })
        }
        currentDate = addDays(currentDate, 1)
      }
      return counts.sort((d1: DashboardDayCount, d2: DashboardDayCount) =>
        d1.date < d2.date ? -1 : 1
      )
    },
    { refetchOnWindowFocus: false }
  )
}

export default useDashboardDataQuery
