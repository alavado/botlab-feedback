import { format, isSaturday, isSunday } from 'date-fns'
import { useQuery, UseQueryResult } from 'react-query'
import useMetricsQuery, { DailyMetrics } from './useMetricsQuery'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/ducks'

export type ProgressMetric =
  | 'TOTAL'
  | 'ANSWERED'
  | 'CONFIRMED'
  | 'CANCELLED'
  | 'UNREACHABLE'

type ProgressMetricData = {
  title: string
  count: string
  label: string
  fillPercentage: number
}

const useMetricsProgressQuery = ({
  metric,
}: {
  metric: ProgressMetric
}): UseQueryResult<ProgressMetricData, any> => {
  const {
    start: startDate,
    end: endDate,
    includeSaturdays,
    includeSundays,
    filters,
  } = useSelector((state: RootState) => state.dashboard)
  const { data: metricsData } = useMetricsQuery()
  const start = format(startDate, 'yyyy-MM-dd')
  const end = format(endDate, 'yyyy-MM-dd')

  return useQuery<any, any, any>(
    [
      'dashboard-progress',
      start,
      end,
      metric,
      includeSaturdays,
      includeSundays,
      filters,
    ],
    (): ProgressMetricData => {
      if (!metricsData) {
        return {
          title: '',
          count: '',
          label: '',
          fillPercentage: 0,
        }
      }
      let filteredMetricsData = filterMetrics({
        data: metricsData,
        filters: [
          (d: DailyMetrics) => !isSaturday(d.date),
          (d: DailyMetrics) => !isSunday(d.date),
        ],
      })
      switch (metric) {
        case 'TOTAL':
          return buildProgressMetricData({
            data: filteredMetricsData,
            metricKey: 'total',
            label: 'Citas',
          })
        case 'ANSWERED':
          return buildProgressMetricData({
            data: filteredMetricsData,
            metricKey: 'answered',
            label: 'Con Respuesta',
          })
        case 'CONFIRMED':
          return buildProgressMetricData({
            data: filteredMetricsData,
            metricKey: 'confirmed',
            label: 'Confirmadas',
          })
        case 'CANCELLED':
          return buildProgressMetricData({
            data: filteredMetricsData,
            metricKey: 'cancelled',
            label: 'Anuladas',
          })
        case 'UNREACHABLE':
          return buildProgressMetricData({
            data: filteredMetricsData,
            metricKey: 'unreachable',
            label: 'Sin Whatsapp',
          })
        default:
          return {
            title: '',
            count: '',
            label: '',
            fillPercentage: 0,
          }
      }
    },
    { enabled: !!metricsData }
  )
}

const filterMetrics = ({
  data,
  filters,
}: {
  data: DailyMetrics[]
  filters: ((f: DailyMetrics) => boolean)[]
}): DailyMetrics[] => {
  let filteredMetricsData = data
  filters.forEach((f) => {
    filteredMetricsData = filteredMetricsData.filter(f)
  })
  return filteredMetricsData
}

const buildProgressMetricData = ({
  data,
  metricKey,
  label,
}: {
  data: DailyMetrics[]
  metricKey: 'total' | 'answered' | 'confirmed' | 'cancelled' | 'unreachable'
  label: string
}): ProgressMetricData => {
  const metricCount = data.reduce(
    (a: number, v: DailyMetrics) => a + v[metricKey],
    0
  )
  if (metricKey === 'total') {
    return {
      title: 'Total',
      count: metricCount.toLocaleString('de-DE'),
      label,
      fillPercentage: 100,
    }
  }
  const total = data.reduce((a: number, v: DailyMetrics) => a + v.total, 0)
  const percentage = total > 0 ? (100 * metricCount) / total : 0
  return {
    title:
      percentage.toLocaleString('de-DE', {
        maximumFractionDigits: 0,
      }) + '%',
    count: metricCount.toLocaleString('de-DE'),
    label,
    fillPercentage: percentage,
  }
}

export default useMetricsProgressQuery
