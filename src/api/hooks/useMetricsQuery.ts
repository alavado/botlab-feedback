import axios from 'axios'
import { addDays, format, isSameDay, parseISO } from 'date-fns'
import { useQuery, UseQueryResult } from 'react-query'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/ducks'
import _ from 'lodash'
import { DashboardFilter } from '../../redux/ducks/dashboard'

export type DailyMetrics = { date: Date; total: number; answered: number }

const useMetricsQuery = ({
  start,
  end,
}: {
  start: Date
  end: Date
}): UseQueryResult<DailyMetrics[], any> => {
  const startStr = format(start, 'yyyy-MM-dd')
  const endStr = format(end, 'yyyy-MM-dd')
  const { idCliente: clientId } = useSelector((state: RootState) => state.login)
  const { filters } = useSelector((state: RootState) => state.dashboard)

  return useQuery<any, any, any>(
    ['metrics', clientId, startStr, endStr, filters],
    async () => {
      const { data } = await axios.get(
        buildMetricsURL({ clientId, start: startStr, end: endStr, filters })
      )
      if (_.isEmpty(data.citas)) {
        return []
      }
      const counts: DailyMetrics[] = data.citas.map((d: any) => ({
        date: parseISO(d.fecha_cita),
        total: d.carga,
        answered: d.respuesta,
      }))
      return fillInEmptyDays({ start, end, counts })
    },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
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
    if (!_.isEmpty(filter.values)) {
      params.append(filter.property.id, filter.values[0])
    }
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
      })
    }
    iterationDate = addDays(iterationDate, 1)
  }
  return _.sortBy(counts, 'date')
}

export default useMetricsQuery
