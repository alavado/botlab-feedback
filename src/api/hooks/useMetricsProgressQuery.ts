import { format } from 'date-fns'
import { useQuery, UseQueryResult } from 'react-query'
import _ from 'lodash'
import useMetricsQuery, { DailyMetrics } from './useMetricsQuery'

export type ProgressMetric = 'TOTAL' | 'ANSWERED'

type ProgressMetricData = {
  title: string
  count: string
  label: string
  fillPercentage: number
}

const useMetricsProgressQuery = ({
  startDate,
  endDate,
  metric,
}: {
  startDate: Date
  endDate: Date
  metric: ProgressMetric
}): UseQueryResult<ProgressMetricData, any> => {
  const start = format(startDate, 'yyyy-MM-dd')
  const end = format(endDate, 'yyyy-MM-dd')
  const { data: metricsData } = useMetricsQuery({ startDate, endDate })

  return useQuery<any, any, any>(
    ['dashboard-progress', start, end, metric],
    (): ProgressMetricData => {
      if (!metricsData) {
        return {
          title: '',
          count: '',
          label: '',
          fillPercentage: 0,
        }
      }
      const total = metricsData.reduce(
        (acc: number, v: DailyMetrics) => acc + v.total,
        0
      )
      const answered = metricsData.reduce(
        (acc: number, v: DailyMetrics) => acc + v.answered,
        0
      )
      switch (metric) {
        case 'TOTAL':
          return {
            title: 'Total',
            count: total.toLocaleString('de-DE'),
            label: 'Citas',
            fillPercentage: 100,
          }
        case 'ANSWERED':
          const percentage = (100 * answered) / total
          return {
            title:
              percentage.toLocaleString('de-DE', { maximumFractionDigits: 0 }) +
              '%',
            count: answered.toLocaleString('de-DE'),
            label: 'Con respuesta',
            fillPercentage: percentage,
          }
        default:
          return {
            title: '',
            count: '',
            label: '',
            fillPercentage: 0,
          }
      }
    },
    { refetchOnWindowFocus: false, enabled: !!metricsData }
  )
}

export default useMetricsProgressQuery
