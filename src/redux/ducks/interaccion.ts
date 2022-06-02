import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface servicioState {
  idServicioInteraccionActiva?: number,
  idUsuarioInteraccionActiva?: number,
}

const interaccionSlice = createSlice({
  name: 'interaccion',
  initialState: {
    idServicioInteraccionActiva: undefined,
    idUsuarioInteraccionActiva: undefined,
  } as servicioState,
  reducers: {
    seleccionaInteraccion(state, action: PayloadAction<[number, number]>) {
      state.idServicioInteraccionActiva = action.payload[0]
      state.idUsuarioInteraccionActiva = action.payload[1]
    },
  }
})

export const {
  seleccionaInteraccion,
} = interaccionSlice.actions

export default interaccionSlice.reducer