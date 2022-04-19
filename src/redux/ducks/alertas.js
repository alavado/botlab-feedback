import { createSlice } from "@reduxjs/toolkit"

export const alertasVisibles = [
  'Número equivocado',
  'Paciente se arrepiente de cancelar su hora',
  'Paciente cancela post confirmación',
  'Paciente reagenda post confirmación',
  'Paciente tiene pregunta o comentario'
]

const alertasSlice = createSlice({
  name: 'alertas',
  initialState: {
    alertaDestacada: undefined,
    recibirNotificaciones: false,
    verAlertas: alertasVisibles,
    cajonActivo: false
  },
  reducers: {
    destacaAlerta(state, { payload: { alerta } }) {
      state.alertaDestacada = alerta
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
    dejaSoloAlertasVisibles(state, { payload }) {
      state.verAlertas = [payload]
    },
    limpiaAlertasVisibles(state, { payload }) {
      state.verAlertas = []
    },
    activaCajon(state, { payload }) {
      state.cajonActivo = payload
    }
  }
})

export const {
  destacaAlerta,
  activaNotificaciones,
  agregaAlertasVisibles,
  remueveAlertasVisibles,
  limpiaAlertasVisibles,
  dejaSoloAlertasVisibles,
  activaCajon
} = alertasSlice.actions

export default alertasSlice.reducer
