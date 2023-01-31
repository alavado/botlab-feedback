import { createSlice } from '@reduxjs/toolkit'

export const mensajesAlertasVisibles = [
  'Paciente quiere reagendar',
  'Número equivocado',
  'Paciente tiene pregunta o comentario',
  'Paciente reagenda post confirmación',
  'Paciente cancela post confirmación',
  'Paciente se arrepiente de cancelar su hora',
  'Mensaje post encuesta',
  'Indica fallecimiento',
]

const alertasSlice = createSlice({
  name: 'alertas',
  initialState: {
    recibirNotificaciones: false,
    verAlertas: mensajesAlertasVisibles,
    sucursalSeleccionada: undefined,
  },
  reducers: {
    activaNotificaciones(state, { payload }) {
      state.recibirNotificaciones = payload
    },
    agregaAlertasVisibles(state, { payload }) {
      state.verAlertas = [...state.verAlertas, payload]
    },
    remueveAlertasVisibles(state, { payload }) {
      state.verAlertas = state.verAlertas.filter((m) => m !== payload)
    },
    dejaSoloAlertasVisibles(state, { payload }) {
      state.verAlertas = [payload]
    },
    limpiaAlertasVisibles(state, { payload }) {
      state.verAlertas = []
    },
    seleccionarSucursal(state, { payload }) {
      state.sucursalSeleccionada = payload
    },
  },
})

export const {
  activaNotificaciones,
  agregaAlertasVisibles,
  remueveAlertasVisibles,
  limpiaAlertasVisibles,
  dejaSoloAlertasVisibles,
  seleccionarSucursal,
} = alertasSlice.actions

export default alertasSlice.reducer
