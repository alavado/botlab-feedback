import { createSlice } from "@reduxjs/toolkit"

const busquedaSlice = createSlice({
  name: 'busqueda',
  initialState: {
    resultadosBusqueda: undefined
  },
  reducers: {
    guardaResultadosBusqueda(state, action) {
      state.resultadosBusqueda = action.payload.data
    },
    comienzaBusqueda(state) {
      state.resultadosBusqueda = undefined
    },
    limpiaBusqueda(state) {
      state.resultadosBusqueda = undefined
    }
  }
})

export const { guardaResultadosBusqueda, comienzaBusqueda, limpiaBusqueda } = busquedaSlice.actions

export default busquedaSlice.reducer