import { format, isSaturday, isSunday } from 'date-fns'
import { useQuery, UseQueryResult } from 'react-query'
import useMetricsQuery, { DailyMetrics } from './useMetricsQuery'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/ducks'

export type ProgressMetric = 'TOTAL' | 'ANSWERED'

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
  } = useSelector((state: RootState) => state.dashboard)
  const { data: metricsData } = useMetricsQuery({
    start: startDate,
    end: endDate,
  })
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
      let filteredMetricsData = metricsData
      if (!includeSaturdays) {
        filteredMetricsData = filteredMetricsData.filter(
          (d) => !isSaturday(d.date)
        )
      }
      if (!includeSundays) {
        filteredMetricsData = filteredMetricsData.filter(
          (d) => !isSunday(d.date)
        )
      }
      const total = filteredMetricsData.reduce(
        (a: number, v: DailyMetrics) => a + v.total,
        0
      )
      const answered = filteredMetricsData.reduce(
        (a: number, v: DailyMetrics) => a + v.answered,
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
          const percentage = total > 0 ? (100 * answered) / total : 0
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
    { enabled: !!metricsData }
  )
}

export default useMetricsProgressQuery
