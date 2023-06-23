import {
  format,
  isSameDay,
  isSaturday,
  isSunday,
  startOfMonth,
  startOfWeek,
} from 'date-fns'
import { useQuery, UseQueryResult } from 'react-query'
import useMetricsQuery, { DailyMetrics } from './useMetricsQuery'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/ducks'

export type MetricsTimeSeriesTimeUnit = 'DAY' | 'WEEK' | 'MONTH'

const useMetricsTimeSeriesQuery = (): UseQueryResult<DailyMetrics[], any> => {
  const {
    start: startDate,
    end: endDate,
    timeUnit,
    includeSaturdays,
    includeSundays,
    filters,
  } = useSelector((state: RootState) => state.dashboard)
  const start = format(startDate, 'yyyy-MM-dd')
  const end = format(endDate, 'yyyy-MM-dd')
  const { data: metricsData } = useMetricsQuery({
    start: startDate,
    end: endDate,
  })

  return useQuery<any, any, any>(
    [
      'dashboard-ts',
      filters,
      start,
      end,
      timeUnit,
      includeSaturdays,
      includeSundays,
    ],
    async () => {
      if (!metricsData) {
        return []
      }
      if (timeUnit === 'WEEK') {
        const weeklyData: DailyMetrics[] = []
        metricsData.forEach((day: DailyMetrics) => {
          const weekStart = startOfWeek(day.date, { weekStartsOn: 1 })
          if (!weeklyData.find((w) => isSameDay(w.date, weekStart))) {
            weeklyData.push({
              date: weekStart,
              total: 0,
              answered: 0,
              cancelled: 0,
              confirmed: 0,
            })
          }
          const i = weeklyData.findIndex((w) => isSameDay(w.date, weekStart))
          weeklyData[i].total += day.total
          weeklyData[i].answered += day.answered
          weeklyData[i].confirmed += day.confirmed
          weeklyData[i].cancelled += day.cancelled
        })
        return weeklyData
      }
      if (timeUnit === 'MONTH') {
        const monthlyData: DailyMetrics[] = []
        metricsData.forEach((day: DailyMetrics) => {
          const monthStart = startOfMonth(day.date)
          if (!monthlyData.find((m) => isSameDay(m.date, monthStart))) {
            monthlyData.push({
              date: monthStart,
              total: 0,
              answered: 0,
              cancelled: 0,
              confirmed: 0,
            })
          }
          const i = monthlyData.findIndex((m) => isSameDay(m.date, monthStart))
          monthlyData[i].total += day.total
          monthlyData[i].answered += day.answered
          monthlyData[i].confirmed += day.confirmed
          monthlyData[i].cancelled += day.cancelled
        })
        return monthlyData
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
      return filteredMetricsData
    },
    {
      enabled: !!metricsData,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  )
}

export default useMetricsTimeSeriesQuery
