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

export type DailyMetrics = { date: Date; total: number; answered: number }

const useMetricsQuery = ({
  startDate,
  endDate,
}: {
  startDate: Date
  endDate: Date
}): UseQueryResult<DailyMetrics[], any> => {
  const start = format(startDate, 'yyyy-MM-dd')
  const end = format(endDate, 'yyyy-MM-dd')
  const { idCliente } = useSelector((state: RootState) => state.login)

  return useQuery<any, any, any>(
    ['metrics', start, end],
    async () => {
      const { data } = await axios.get(
        `https://dashboard-api-ysuyrps2hq-tl.a.run.app/client/${idCliente}/metrics2?start_date=${start}&end_date=${end}`
      )
      if (_.isEmpty(data.citas)) {
        return []
      }
      const counts: DailyMetrics[] = data.citas.map((d: any) => ({
        date: parseISO(d.fecha_cita),
        total: d.carga,
        answered: d.respuesta,
      }))

      let iterationDate = startDate
      while (differenceInDays(endDate, iterationDate) >= 0) {
        const dateExists = counts.some((c: DailyMetrics) =>
          isSameDay(c.date, iterationDate)
        )
        if (!dateExists) {
          counts.push({
            date: iterationDate,
            total: 0,
            answered: 0,
          })
        }
        iterationDate = addDays(iterationDate, 1)
      }
      return counts.sort((d1: DailyMetrics, d2: DailyMetrics) =>
        d1.date < d2.date ? -1 : 1
      )
    },
    { refetchOnWindowFocus: false }
  )
}

export default useMetricsQuery
