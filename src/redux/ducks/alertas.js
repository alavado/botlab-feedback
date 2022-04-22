import { createSlice } from "@reduxjs/toolkit"

export const alertasVisibles = [
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
    idAlertaDestacada: undefined,
    recibirNotificaciones: false,
    verAlertas: alertasVisibles,
    cajonActivo: false
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
