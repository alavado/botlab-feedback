import { createSlice } from "@reduxjs/toolkit"

export const ESQUEMA_CLARO = 'ESQUEMA_CLARO'
export const ESQUEMA_OSCURO = 'ESQUEMA_OSCURO'

const opcionesSlice = createSlice({
  name: 'opciones',
  initialState: {
    chatExpandido: false,
    contacto: '',
    seleccionarRangoFechas: true,
    tableroVisible: false,
    esquema: ESQUEMA_CLARO
  },
  reducers: {
    guardaIdEncuesta(state, action) {
      state.idEncuestaGuardada = action.payload
    },
    fijaChatExpandido(state, action) {
      state.chatExpandido = action.payload
    },
    cambiaEsquemaColor(state) {
      state.esquema = state.esquema === ESQUEMA_CLARO ? ESQUEMA_OSCURO : ESQUEMA_CLARO
    },
    guardaContacto(state, action) {
      state.contacto = action.payload
    },
    fijaOpcionSeleccionarRangoFechas(state, action) {
      state.seleccionarRangoFechas = action.payload
    },
    fijaOpcionTableroVisible(state, action) {
      state.tableroVisible = action.payload
    }
  }
})

export const {
  guardaIdEncuesta,
  fijaChatExpandido,
  cambiaEsquemaColor,
  guardaContacto,
  fijaOpcionSeleccionarRangoFechas,
  fijaOpcionTableroVisible
} = opcionesSlice.actions

export default opcionesSlice.reducer
