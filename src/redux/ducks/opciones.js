import { createSlice } from "@reduxjs/toolkit"

export const ESQUEMA_CLARO = 'ESQUEMA_CLARO'
export const ESQUEMA_OSCURO = 'ESQUEMA_OSCURO'

const opcionesSlice = createSlice({
  name: 'opciones',
  esquema: ESQUEMA_CLARO,
  initialState: {
    chatExpandido: false
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
    }
  }
})

export const { guardaIdEncuesta, fijaChatExpandido, cambiaEsquemaColor } = opcionesSlice.actions

export default opcionesSlice.reducer
