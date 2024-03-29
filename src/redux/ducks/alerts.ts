import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import _ from 'lodash'
import { AlertTypeId, BranchId, ServiceId } from '../../api/types/domain'

interface AlertsState {
  hiddenBranches: BranchId[]
  hiddenServices: ServiceId[]
  hiddenAlertTypes: AlertTypeId[]
  notificationsEnabled: boolean
  settingsHidden: boolean
}

const alertsSlice = createSlice({
  name: 'alerts',
  initialState: {
    hiddenBranches: [],
    hiddenServices: [],
    hiddenAlertTypes: [],
    notificationsEnabled: true,
    settingsHidden: false,
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
    hideBranchesOrShowIfAllHidden(state, action: PayloadAction<BranchId[]>) {
      if (state.hiddenBranches.length !== action.payload.length) {
        state.hiddenBranches = action.payload
      } else {
        state.hiddenBranches = []
      }
    },
    hideServicesOrShowIfAllHidden(state, action: PayloadAction<ServiceId[]>) {
      if (state.hiddenServices.length !== action.payload.length) {
        state.hiddenServices = action.payload
      } else {
        state.hiddenServices = []
      }
    },
    hideAlertTypeShowIfAllHidden(state, action: PayloadAction<AlertTypeId[]>) {
      if (state.hiddenAlertTypes.length !== action.payload.length) {
        state.hiddenAlertTypes = action.payload
      } else {
        state.hiddenAlertTypes = []
      }
    },
    hideSettings(state) {
      state.settingsHidden = true
    },
    showSettings(state) {
      state.settingsHidden = false
    },
  },
})

export const {
  toggleBranch,
  toggleService,
  toggleAlertType,
  toggleNotifications,
  hideBranchesOrShowIfAllHidden,
  hideServicesOrShowIfAllHidden,
  hideAlertTypeShowIfAllHidden,
  hideSettings,
  showSettings,
} = alertsSlice.actions

export default alertsSlice.reducer
