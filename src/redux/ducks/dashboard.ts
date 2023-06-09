import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { addDays } from 'date-fns'
import { MetricsTimeSeriesGroupByUnit } from '../../api/hooks/useMetricsTimeSeriesQuery'
import {
  MetricFilterByAppointmentProperty,
  MetricFilterByAppointmentPropertyKind,
} from '../../api/hooks/useMetricsFiltersQuery'

export type DashboardFilter = {
  property: MetricFilterByAppointmentProperty
  values: string[]
}

interface DashboardState {
  start: Date
  end: Date
  skipEmptyDays: boolean
  groupBy: MetricsTimeSeriesGroupByUnit
  filters: DashboardFilter[]
}

const initialGrouping = 'DAY'
const pastDaysInitialRange = 7

const Dashboard = createSlice({
  name: 'Dashboard',
  initialState: {
    start: addDays(new Date(), -pastDaysInitialRange),
    end: new Date(),
    skipEmptyDays: false,
    groupBy: initialGrouping,
    filters: [],
  } as DashboardState,
  reducers: {
    setStartDate(state, action: PayloadAction<Date>) {
      state.start = action.payload
    },
    setEndDate(state, action: PayloadAction<Date>) {
      state.end = action.payload
    },
    setSkipEmptyDays(state, action: PayloadAction<boolean>) {
      state.skipEmptyDays = action.payload
    },
    setGroupByUnit(state, action: PayloadAction<MetricsTimeSeriesGroupByUnit>) {
      state.groupBy = action.payload
    },
    addFilter(
      state,
      action: PayloadAction<{
        property: MetricFilterByAppointmentProperty
        value: string
        multiLevel: boolean
      }>
    ) {
      const { property, value, multiLevel } = action.payload
      const stateFilter = state.filters.find(
        (f) => f.property.id === property.id
      )
      if (!stateFilter) {
        state.filters.push({
          property,
          values: [value],
        })
      } else {
        if (property.kind === MetricFilterByAppointmentPropertyKind.LEVELS) {
          if (multiLevel) {
            stateFilter.values.push(value)
          } else {
            stateFilter.values = [value]
          }
        } else {
          stateFilter.values = [value]
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
      const { property, value } = action.payload
      const filter = state.filters.find((f) => f.property.id === property.id)
      if (filter) {
        if (
          filter.property.kind === MetricFilterByAppointmentPropertyKind.LEVELS
        ) {
          state.filters = [
            ...state.filters,
            {
              property,
              values: filter.values.filter((v) => v !== value),
            },
          ]
        } else {
          state.filters = state.filters.filter(
            (f) => f.property.id !== property.id
          )
        }
      }
    },
    clearFilter(
      state,
      action: PayloadAction<{
        property: MetricFilterByAppointmentProperty
      }>
    ) {
      state.filters = state.filters.filter(
        (f) => f.property.id !== action.payload.property.id
      )
    },
  },
})

export const {
  setStartDate,
  setEndDate,
  setSkipEmptyDays,
  setGroupByUnit,
  addFilter,
  removeFilter,
  clearFilter,
} = Dashboard.actions

export default Dashboard.reducer