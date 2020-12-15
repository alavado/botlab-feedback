import { createSlice } from '@reduxjs/toolkit'

const encuestasSlice = createSlice({
  name: 'encuestas',
  initialState: {},
  reducers: {
    guardaTiposEncuestas(state, action) {
      state.tipos = action.payload.polls.map(({ id, name }) => ({
        id,
        nombre: name
      }))
    },
    guardaHeadersEncuesta(state, action) {
      const { id, data } = action.payload
      state.idEncuestaSeleccionada = id
      state.headers = data.data.data.map(({ name, display_name, type }) => ({
        nombre: name,
        texto: display_name,
        tipo: type
      }))
    },
    guardaHeaders(state, action) {
      state.todosLosHeaders = action.payload.data.data
    },
    limpiaEncuestas(state) {
      state = {}
    }
  }
})

export const {
  guardaTiposEncuestas,
  guardaHeadersEncuesta,
  guardaHeaders,
  limpiaEncuestas
} = encuestasSlice.actions

export default encuestasSlice.reducer