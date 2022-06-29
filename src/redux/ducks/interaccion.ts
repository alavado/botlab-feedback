import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface servicioState {
  idServicioInteraccionActiva?: number,
  idUsuarioInteraccionActiva?: number,
  inicioInteraccionActiva?: Date,
}

const interaccionSlice = createSlice({
  name: 'interaccion',
  initialState: {
    idServicioInteraccionActiva: undefined,
    idUsuarioInteraccionActiva: undefined,
    inicioInteraccionActiva: undefined,
  } as servicioState,
  reducers: {
    seleccionaInteraccion(state, action: PayloadAction<[number, number, Date]>) {
      state.idServicioInteraccionActiva = action.payload[0]
      state.idUsuarioInteraccionActiva = action.payload[1]
      state.inicioInteraccionActiva = action.payload[2]
    },
  }
})

export const {
  seleccionaInteraccion,
} = interaccionSlice.actions

export default interaccionSlice.reducer