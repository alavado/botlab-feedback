import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { addDays } from 'date-fns'
import { MetricsTimeSeriesTimeUnit } from '../../api/hooks/useMetricsTimeSeriesQuery'
import { MetricFilterByAppointmentProperty } from '../../api/hooks/useMetricsFiltersQuery'
import _ from 'lodash'

export type DashboardFilter = {
  property: MetricFilterByAppointmentProperty
  values: string[]
}

interface DashboardState {
  start: Date
  end: Date
  includeWeekends: boolean
  includeSaturdays: boolean
  includeSundays: boolean
  timeUnit: MetricsTimeSeriesTimeUnit
  filters: DashboardFilter[] | 'NO_FILTERS'
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
    filters: 'NO_FILTERS',
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
      state.timeUnit = action.payload
    },
    addFilter(
      state,
      action: PayloadAction<{
        property: MetricFilterByAppointmentProperty
        value: string
      }>
    ) {
      const { property, value } = action.payload
      if (state.filters === 'NO_FILTERS') {
        state.filters = [
          {
            property,
            values: [value],
          },
        ]
      } else {
        const filter = state.filters.find((f) => f.property.id === property.id)
        if (filter) {
          filter.values.push(value)
        } else {
          state.filters.push({
            property,
            values: [value],
          })
        }
      }
    },
    removeFilter(
      state,
      action: PayloadAction<{
        property: MetricFilterByAppointmentProperty
        value: string
      }>
    ) {
      if (state.filters === 'NO_FILTERS') {
        return
      }
      const { property, value } = action.payload
      const filter = state.filters.find((f) => f.property.id === property.id)
      if (!filter) {
        return
      }
      const valuesWithoutOldValues = filter.values.filter((v) => v !== value)
      if (_.isEmpty(valuesWithoutOldValues)) {
        state.filters = state.filters.filter(
          (f) => f.property.id !== property.id
        )
        if (_.isEmpty(state.filters)) {
          state.filters = 'NO_FILTERS'
        }
        return
      }
      const filterWithoutValue: DashboardFilter = {
        property,
        values: filter.values.filter((v) => v !== value),
      }
      state.filters = [
        ...state.filters.filter((f) => f.property.id !== property.id),
        filterWithoutValue,
      ]
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
