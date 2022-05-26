import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IDEstadoInteraccion } from '../../api/types/servicio'

interface servicioState {
  idServicioActivo: undefined | number,
  idEstadoInteraccionActivo: undefined | IDEstadoInteraccion,
  fechaInicio: Date,
  fechaTermino: Date,
}

const servicioSlice = createSlice({
  name: 'servicio',
  initialState: {
    idServicioActivo: undefined,
    idEstadoInteraccionActivo: undefined,
    fechaInicio: new Date(),
    fechaTermino: new Date(),
  } as servicioState,
  reducers: {
    seleccionaServicio(state, action: PayloadAction<number>) {
      state.idServicioActivo = action.payload
    },
    seleccionaEstadoInteraccion(state, action: PayloadAction<IDEstadoInteraccion>) {
      state.idEstadoInteraccionActivo = action.payload
    },
  }
})

export const {
  seleccionaServicio,
  seleccionaEstadoInteraccion,
} = servicioSlice.actions

export default servicioSlice.reducer