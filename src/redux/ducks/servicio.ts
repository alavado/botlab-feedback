import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IDResultadoInteraccion } from '../../api/types/servicio'

interface servicioState {
  idServicioActivo: Number | undefined,
  idResultadoInteraccionActivo: IDResultadoInteraccion,
  fechaInicio: Date,
  fechaTermino: Date,
}

const servicioSlice = createSlice({
  name: 'servicio',
  initialState: {
    idServicioActivo: undefined,
    idResultadoInteraccionActivo: 'PENDIENTE',
    fechaInicio: new Date(),
    fechaTermino: new Date(),
  } as servicioState,
  reducers: {
    seleccionaServicio(state, action: PayloadAction<Number>) {
      state.idServicioActivo = action.payload
    }
  }
})

export const {
  seleccionaServicio,
} = servicioSlice.actions

export default servicioSlice.reducer