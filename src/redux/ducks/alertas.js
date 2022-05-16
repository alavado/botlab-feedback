import { createSlice } from "@reduxjs/toolkit"

export const mensajesAlertasVisibles = [
  'Número equivocado',
  'Paciente tiene pregunta o comentario',
  'Paciente reagenda post confirmación',
  'Paciente cancela post confirmación',
  'Paciente se arrepiente de cancelar su hora',
  'Mensaje post encuesta'
]

const alertasSlice = createSlice({
  name: 'alertas',
  initialState: {
    recibirNotificaciones: false,
    verAlertas: mensajesAlertasVisibles,
  },
  reducers: {
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
  }
})

export const {
  activaNotificaciones,
  agregaAlertasVisibles,
  remueveAlertasVisibles,
  limpiaAlertasVisibles,
  dejaSoloAlertasVisibles,
} = alertasSlice.actions

export default alertasSlice.reducer
