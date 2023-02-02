import { createSlice, PayloadAction } from '@reduxjs/toolkit'
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
    hideBranch(state, action: PayloadAction<BranchId>) {
      state.hiddenBranches.push(action.payload)
    },
    showBranch(state, action: PayloadAction<BranchId>) {
      state.hiddenBranches = state.hiddenBranches.filter(
        (branchId) => branchId !== action.payload
      )
    },
    hideService(state, action: PayloadAction<ServiceId>) {
      state.hiddenServices.push(action.payload)
    },
    showService(state, action: PayloadAction<ServiceId>) {
      state.hiddenServices = state.hiddenServices.filter(
        (serviceId) => serviceId !== action.payload
      )
    },
    hideAlertType(state, action: PayloadAction<AlertTypeId>) {
      state.hiddenAlertTypes.push(action.payload)
    },
    showAlertType(state, action: PayloadAction<AlertTypeId>) {
      state.hiddenAlertTypes = state.hiddenAlertTypes.filter(
        (alertTypeId) => alertTypeId !== action.payload
      )
    },
    disableNotifications(state) {
      state.notificationsEnabled = false
    },
    enableNotifications(state) {
      state.notificationsEnabled = true
    },
  },
})

export const {
  hideBranch,
  showBranch,
  hideService,
  showService,
  hideAlertType,
  showAlertType,
  disableNotifications,
  enableNotifications,
} = alertsSlice.actions

export default alertsSlice.reducer
