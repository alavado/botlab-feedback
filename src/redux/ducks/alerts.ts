import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import _ from 'lodash'
import { AlertTypeId, BranchId, ServiceId } from '../../api/types/servicio'

interface AlertsState {
  hiddenBranches: BranchId[]
  hiddenServices: ServiceId[]
  hiddenAlertTypes: AlertTypeId[]
  notificationsEnabled: boolean
}

const alertsSlice = createSlice({
  name: 'alerts',
  initialState: {
    hiddenBranches: [],
    hiddenServices: [],
    hiddenAlertTypes: [],
    notificationsEnabled: true,
  } as AlertsState,
  reducers: {
    toggleBranch(state, action: PayloadAction<BranchId>) {
      state.hiddenBranches = _.xor(state.hiddenBranches, [action.payload])
    },
    toggleService(state, action: PayloadAction<ServiceId>) {
      state.hiddenServices = _.xor(state.hiddenServices, [action.payload])
    },
    toggleAlertType(state, action: PayloadAction<AlertTypeId>) {
      state.hiddenAlertTypes = _.xor(state.hiddenAlertTypes, [action.payload])
    },
    toggleNotifications(state) {
      state.notificationsEnabled = !state.notificationsEnabled
    },
  },
})

export const {
  toggleBranch,
  toggleService,
  toggleAlertType,
  toggleNotifications,
} = alertsSlice.actions

export default alertsSlice.reducer
