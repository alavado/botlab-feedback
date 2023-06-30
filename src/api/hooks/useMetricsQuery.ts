import axios from 'axios'
import { addDays, format, isSameDay, parseISO } from 'date-fns'
import { useQuery, UseQueryResult } from 'react-query'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/ducks'
import _ from 'lodash'
import { DashboardFilter } from '../../redux/ducks/dashboard'

export type DailyMetrics = {
  date: Date
  total: number
  answered: number
  confirmed: number
  cancelled: number
  unreachable: number
}

const staleTimeMinutes = 30

const useMetricsQuery = (): UseQueryResult<DailyMetrics[], any> => {
  const { filters, start, end } = useSelector(
    (state: RootState) => state.dashboard
  )
  const startStr = format(start, 'yyyy-MM-dd')
  const endStr = format(end, 'yyyy-MM-dd')
  const { idCliente: clientId } = useSelector((state: RootState) => state.login)

  return useQuery<any, any, any>(
    ['metrics', clientId, startStr, endStr, JSON.stringify(filters)],
    async () => {
      const { data } = await axios.get(
        buildMetricsURL({
          clientId,
          start: startStr,
          end: endStr,
          filters: filters === 'EVERYTHING' ? [] : filters,
        })
      )
      if (_.isEmpty(data.citas)) {
        return []
      }
      const counts: DailyMetrics[] = data.citas.map(
        (d: any): DailyMetrics => ({
          date: parseISO(d.fecha_cita),
          total: d.carga || 0,
          answered: d.respuesta || 0,
          confirmed: d.confirmadas || 0,
          cancelled: d.canceladas || 0,
          unreachable: d.inalcanzables || 0,
        })
      )
      return fillInEmptyDays({ start, end, counts })
    },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      staleTime: staleTimeMinutes * 60_000,
    }
  )
}

const buildMetricsURL = ({
  clientId,
  start,
  end,
  filters,
}: {
  clientId?: number
  start: string
  end: string
  filters: DashboardFilter[]
}): string => {
  let url = new URL(
    `https://dashboard-api-ysuyrps2hq-tl.a.run.app/client/${clientId}/metrics2`
  )
  const params = url.searchParams
  params.append('start_date', start)
  params.append('end_date', end)
  filters.forEach((filter) => {
    params.append(filter.propertyId, filter.value)
  })
  return url.toString()
}

const fillInEmptyDays = ({
  start,
  end,
  counts,
}: {
  start: Date
  end: Date
  counts: DailyMetrics[]
}) => {
  let iterationDate = start
  while (!isSameDay(end, iterationDate)) {
    const dateExists = counts.some((c: DailyMetrics) =>
      isSameDay(c.date, iterationDate)
    )
    if (!dateExists) {
      counts.push({
        date: iterationDate,
        total: 0,
        answered: 0,
        confirmed: 0,
        cancelled: 0,
        unreachable: 0,
      })
    }
    iterationDate = addDays(iterationDate, 1)
  }
  return _.sortBy(counts, 'date')
}

export default useMetricsQuery
