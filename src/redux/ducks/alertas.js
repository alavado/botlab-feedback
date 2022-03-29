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
    idAlertaDestacada: undefined,
    recibirNotificaciones: false,
    verAlertas: alertasVisibles
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
    dejaSoloAlertasVisibles(state, { payload }) {
      state.verAlertas = [payload]
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
  limpiaAlertasVisibles,
  dejaSoloAlertasVisibles
} = alertasSlice.actions

export default alertasSlice.reducer
