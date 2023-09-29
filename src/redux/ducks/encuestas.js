import { createSlice } from '@reduxjs/toolkit'

export const CANAL_HEADER_NAME = 'canal'

const encuestasSlice = createSlice({
  name: 'encuestas',
  initialState: {},
  reducers: {
    guardaTiposEncuestas(state, action) {
      const tiposOrdenados = action.payload.polls.sort((x, y) =>
        x.name.localeCompare(y.name)
      )
      state.tipos = tiposOrdenados.map(
        ({ id, name, enabled, integrations, sucursales, script }) => ({
          id,
          nombre: name,
          enabled,
          integrations,
          sucursales: sucursales.map((s) => s.name),
        })
      )
    },
    guardaHeadersEncuesta(state, action) {
      const { id, data } = action.payload
      state.idEncuestaSeleccionada = id
      state.headers = [
        { nombre: CANAL_HEADER_NAME, texto: 'Canal', tipo: 'ICON' },
        ...data.data.data.map(({ name, display_name, type }) => ({
          nombre: name,
          texto: display_name,
          tipo: type,
        })),
      ]
    },
    guardaHeaders(state, action) {
      state.todosLosHeaders = action.payload.data.data
    },
    limpiaEncuestas(state) {
      state.idEncuestaSeleccionada = undefined
      state.headers = undefined
      state.todosLosHeaders = undefined
      state.tipos = undefined
    },
  },
})

export const {
  guardaTiposEncuestas,
  guardaHeadersEncuesta,
  guardaHeaders,
  limpiaEncuestas,
} = encuestasSlice.actions

export default encuestasSlice.reducer
