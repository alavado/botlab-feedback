import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IDEstadoInteraccion } from '../../api/types/servicio'

interface servicioState {
  idServicioActivo: Number | undefined,
  idEstadoInteraccionActivo: IDEstadoInteraccion,
  fechaInicio: Date,
  fechaTermino: Date,
}

const servicioSlice = createSlice({
  name: 'servicio',
  initialState: {
    idServicioActivo: undefined,
    idEstadoInteraccionActivo: 'PENDIENTE',
    fechaInicio: new Date(),
    fechaTermino: new Date(),
  } as servicioState,
  reducers: {
    seleccionaServicio(state, action: PayloadAction<Number>) {
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