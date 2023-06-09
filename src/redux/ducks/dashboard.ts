import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { addDays } from 'date-fns'
import { MetricsTimeSeriesGroupByUnit } from '../../api/hooks/useMetricsTimeSeriesQuery'

interface DashboardState {
  startDate: Date
  endDate: Date
  skipEmptyDays: boolean
  groupBy: MetricsTimeSeriesGroupByUnit
}

const Dashboard = createSlice({
  name: 'Dashboard',
  initialState: {
    startDate: addDays(new Date(), -7),
    endDate: new Date(),
    skipEmptyDays: false,
    groupBy: 'DAY',
  } as DashboardState,
  reducers: {
    setStartDate(state, action: PayloadAction<Date>) {
      state.startDate = action.payload
    },
    setEndDate(state, action: PayloadAction<Date>) {
      state.endDate = action.payload
    },
    setSkipEmptyDays(state, action: PayloadAction<boolean>) {
      state.skipEmptyDays = action.payload
    },
    setGroupByUnit(state, action: PayloadAction<MetricsTimeSeriesGroupByUnit>) {
      state.groupBy = action.payload
    },
  },
})

export const { setStartDate, setEndDate, setSkipEmptyDays, setGroupByUnit } =
  Dashboard.actions

export default Dashboard.reducer
