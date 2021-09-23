import { createSlice } from "@reduxjs/toolkit"

const enviadorSlice = createSlice({
  name: 'enviador',
  initialState: {
    activo: false
  },
  reducers: {
    activaEnviador(state) {
      state.activo = true
    },
    desactivaEnviador(state) {
      state.activo = false
    }
  }
})

export const { activaEnviador, desactivaEnviador } = enviadorSlice.actions

export default enviadorSlice.reducer
