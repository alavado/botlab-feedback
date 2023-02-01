import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Interaction } from '../../api/types/servicio'

interface AlertsState {}

const alertsSlice = createSlice({
  name: 'alerts',
  initialState: {} as AlertsState,
  reducers: {
    setAlertStatus(state, action: PayloadAction<string>) {},
  },
})

export const { setAlertStatus } = alertsSlice.actions

export default alertsSlice.reducer
