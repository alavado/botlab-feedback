import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
  addDays,
  addMonths,
  endOfMonth,
  endOfWeek,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from 'date-fns'
import { MetricsTimeSeriesTimeUnit } from '../../api/hooks/useMetricsTimeSeriesQuery'
import { MetricFilterByAppointmentProperty } from '../../api/hooks/useMetricsFiltersQuery'
import _ from 'lodash'

export type DashboardFilter = {
  propertyId: MetricFilterByAppointmentProperty['id']
  value: string
}

interface DashboardState {
  start: Date
  end: Date
  includeWeekends: boolean
  includeSaturdays: boolean
  includeSundays: boolean
  timeUnit: MetricsTimeSeriesTimeUnit
  filters: DashboardFilter[] | 'EVERYTHING'
}

const initialGrouping = 'DAY'
const pastDaysInitialRange = 7

const Dashboard = createSlice({
  name: 'Dashboard',
  initialState: {
    start: addDays(new Date(), -pastDaysInitialRange),
    end: new Date(),
    includeWeekends: true,
    includeSaturdays: true,
    includeSundays: true,
    timeUnit: initialGrouping,
    filters: 'EVERYTHING',
  } as DashboardState,
  reducers: {
    setStartDate(state, action: PayloadAction<Date>) {
      state.start = action.payload
    },
    setEndDate(state, action: PayloadAction<Date>) {
      state.end = action.payload
    },
    setIncludeWeekends(state, action: PayloadAction<boolean>) {
      state.includeWeekends = action.payload
      state.includeSaturdays = action.payload
      state.includeSundays = action.payload
    },
    setIncludeSaturdays(state, action: PayloadAction<boolean>) {
      state.includeSaturdays = action.payload
      state.includeWeekends = action.payload || state.includeSundays
    },
    setIncludeSundays(state, action: PayloadAction<boolean>) {
      state.includeSundays = action.payload
      state.includeWeekends = action.payload || state.includeSaturdays
    },
    setGroupByUnit(state, action: PayloadAction<MetricsTimeSeriesTimeUnit>) {
      const timeUnit = action.payload
      state.timeUnit = timeUnit
      if (timeUnit === 'MONTH') {
        if (isSameMonth(state.start, state.end)) {
          state.start = startOfMonth(addMonths(state.start, -1))
        } else {
          state.start = startOfMonth(state.start)
        }
        state.end = endOfMonth(state.end)
      } else if (timeUnit === 'WEEK') {
        state.start = startOfWeek(state.start, { weekStartsOn: 1 })
        state.end = endOfWeek(state.end, { weekStartsOn: 1 })
      }
    },
    addFilter(
      state,
      action: PayloadAction<{
        propertyId: MetricFilterByAppointmentProperty['id']
        value: string
      }>
    ) {
      const { propertyId, value } = action.payload
      if (state.filters === 'EVERYTHING') {
        state.filters = [
          {
            propertyId,
            value,
          },
        ]
        return
      }
      state.filters.push({
        propertyId,
        value,
      })
      state.filters = _.sortBy(state.filters, 'value')
    },
    removeFilter(
      state,
      action: PayloadAction<{
        propertyId: MetricFilterByAppointmentProperty['id']
        value: string
      }>
    ) {
      if (state.filters === 'EVERYTHING') {
        return
      }
      const { propertyId, value } = action.payload
      state.filters = state.filters.filter(
        (f) => f.propertyId !== propertyId || f.value !== value
      )
      if (_.isEmpty(state.filters)) {
        state.filters = 'EVERYTHING'
      }
    },
  },
})

export const {
  setStartDate,
  setEndDate,
  setIncludeWeekends,
  setIncludeSaturdays,
  setIncludeSundays,
  setGroupByUnit,
  addFilter,
  removeFilter,
} = Dashboard.actions

export default Dashboard.reducer
