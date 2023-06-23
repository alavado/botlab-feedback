import {
  endOfMonth,
  endOfWeek,
  parse,
  parseISO,
  setYear,
  startOfMonth,
  startOfWeek,
} from 'date-fns'
import { MetricsTimeSeriesTimeUnit } from '../../../../api/hooks/useMetricsTimeSeriesQuery'

export const getInputType = (unit: MetricsTimeSeriesTimeUnit): string => {
  switch (unit) {
    case 'MONTH':
      return 'month'
    case 'WEEK':
      return 'week'
    default:
      return 'date'
  }
}

export const getDateFormat = (unit: MetricsTimeSeriesTimeUnit): string => {
  switch (unit) {
    case 'MONTH':
      return 'yyyy-MM'
    case 'WEEK':
      return "yyyy-'W'II"
    default:
      return 'yyyy-MM-dd'
  }
}

export const getDateFromFormattedDate = (
  unit: MetricsTimeSeriesTimeUnit,
  formattedDate: string,
  bound: 'START' | 'END'
): Date => {
  switch (unit) {
    case 'MONTH':
      const monthDate = parse(formattedDate, 'yyyy-MM', new Date())
      if (bound === 'START') {
        return startOfMonth(monthDate)
      }
      return endOfMonth(monthDate)
    case 'WEEK':
      const [year, week] = formattedDate.split('-W')
      const weekDate = parse(week, 'II', new Date())
      const yearAndWeekDate = setYear(weekDate, Number(year))
      if (bound === 'START') {
        startOfWeek(yearAndWeekDate)
      }
      return endOfWeek(yearAndWeekDate)
    default:
      return parseISO(formattedDate)
  }
}
