import { format, isSameDay, startOfMonth, startOfWeek } from 'date-fns'
import { useQuery, UseQueryResult } from 'react-query'
import useMetricsQuery, { DailyMetrics } from './useMetricsQuery'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/ducks'

export type MetricsTimeSeriesGroupByUnit = 'DAY' | 'WEEK' | 'MONTH'

const useMetricsTimeSeriesQuery = (): UseQueryResult<DailyMetrics[], any> => {
  const {
    start: startDate,
    end: endDate,
    groupBy,
    skipEmptyDays,
  } = useSelector((state: RootState) => state.dashboard)
  const start = format(startDate, 'yyyy-MM-dd')
  const end = format(endDate, 'yyyy-MM-dd')
  const { data: metricsData } = useMetricsQuery({
    start: startDate,
    end: endDate,
  })

  return useQuery<any, any, any>(
    ['dashboard-ts', start, end, groupBy, skipEmptyDays],
    async () => {
      if (!metricsData) {
        return []
      }
      if (groupBy === 'WEEK') {
        const weeklyData: DailyMetrics[] = []
        metricsData.forEach((day: DailyMetrics) => {
          const weekStart = startOfWeek(day.date)
          if (!weeklyData.find((w) => isSameDay(w.date, weekStart))) {
            weeklyData.push({
              date: weekStart,
              total: 0,
              answered: 0,
            })
          }
          const i = weeklyData.findIndex((w) => isSameDay(w.date, weekStart))
          weeklyData[i].total += day.total
          weeklyData[i].answered += day.answered
        })
        return weeklyData
      }
      if (groupBy === 'MONTH') {
        const monthlyData: DailyMetrics[] = []
        metricsData.forEach((day: DailyMetrics) => {
          const monthStart = startOfMonth(day.date)
          if (!monthlyData.find((m) => isSameDay(m.date, monthStart))) {
            monthlyData.push({
              date: monthStart,
              total: 0,
              answered: 0,
            })
          }
          const i = monthlyData.findIndex((m) => isSameDay(m.date, monthStart))
          monthlyData[i].total += day.total
          monthlyData[i].answered += day.answered
        })
        return monthlyData
      }
      return skipEmptyDays
        ? metricsData.filter((d) => d.total > 0)
        : metricsData
    },
    { enabled: !!metricsData }
  )
}

export default useMetricsTimeSeriesQuery
