import { createSlice } from "@reduxjs/toolkit"

const alertasSlice = createSlice({
  name: 'alertas',
  initialState: {
    idAlertaDestacada: undefined,
    recibirNotificaciones: false,
    verAlertas: []
  },
  reducers: {
    destacaAlerta(state, { payload: { id } }) {
      state.idAlertaDestacada = id
    },
    activaNotificaciones(state, { payload }) {
      state.recibirNotificaciones = payload
    },
    agregaAlertasVisibles(state, { payload }) {
      state.verAlertas = [...state.verAlertas, payload]
    },
    remueveAlertasVisibles(state, { payload }) {
      state.verAlertas = state.verAlertas.filter(m => m !== payload)
    },
    limpiaAlertasVisibles(state, { payload }) {
      state.verAlertas = []
    }
  }
})

export const {
  destacaAlerta,
  activaNotificaciones,
  agregaAlertasVisibles,
  remueveAlertasVisibles,
  limpiaAlertasVisibles
} = alertasSlice.actions

export default alertasSlice.reducer
