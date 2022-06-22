import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IDEstadoInteraccion } from '../../api/types/servicio'

interface servicioState {
  idServicioActivo?: number,
  idEstadoInteraccionActivo?: IDEstadoInteraccion,
  fechaInicio: Date,
  fechaTermino: Date,
  cajonFiltrosVisible: boolean,
  cajonInteraccionVisible: boolean,
}

const servicioSlice = createSlice({
  name: 'servicio',
  initialState: {
    idServicioActivo: undefined,
    idEstadoInteraccionActivo: undefined,
    fechaInicio: new Date(),
    fechaTermino: new Date(),
    cajonFiltrosVisible: false,
    cajonInteraccionVisible: false,
  } as servicioState,
  reducers: {
    seleccionaServicio(state, action: PayloadAction<number>) {
      state.idServicioActivo = action.payload
    },
    seleccionaEstadoInteraccion(state, action: PayloadAction<IDEstadoInteraccion>) {
      state.idEstadoInteraccionActivo = action.payload
    },
    toggleCajonFiltros(state) {
      state.cajonFiltrosVisible = !state.cajonFiltrosVisible
    },
    muestraCajonInteraccion(state) {
      state.cajonInteraccionVisible = true
    },
    escondeCajonInteraccion(state) {
      state.cajonInteraccionVisible = false
    },
    seleccionaFechaInicio(state, action) {
      state.fechaInicio = action.payload
      state.fechaTermino = action.payload
    }
  }
})

export const {
  seleccionaServicio,
  seleccionaEstadoInteraccion,
  toggleCajonFiltros,
  muestraCajonInteraccion,
  escondeCajonInteraccion,
  seleccionaFechaInicio,
} = servicioSlice.actions

export default servicioSlice.reducer