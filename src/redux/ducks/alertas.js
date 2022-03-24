import { createSlice } from "@reduxjs/toolkit"

const alertasSlice = createSlice({
  name: 'alertas',
  initialState: {
    idAlertaDestacada: undefined,
    recibirNotificaciones: false
  },
  reducers: {
    destacarAlerta(state, { payload: { id } }) {
      state.idAlertaDestacada = id
    },
    activaNotificaciones(state, { payload }) {
      state.recibirNotificaciones = payload
    }
  }
})

export const { destacarAlerta, activaNotificaciones: activarNotificaciones } = alertasSlice.actions

export default alertasSlice.reducer
