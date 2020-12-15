import { createSlice } from "@reduxjs/toolkit"

const opcionesSlice = createSlice({
  name: 'opciones',
  initialState: {
    chatExpandido: false
  },
  reducers: {
    guardaIdEncuesta(state, action) {
      state.idEncuestaGuardada = action.payload
    },
    fijaChatExpandido(state, action) {
      state.chatExpandido = action.payload
    }
  }
})

export const { guardaIdEncuesta, fijaChatExpandido } = opcionesSlice.actions

export default opcionesSlice.reducer
