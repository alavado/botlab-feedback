import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { IDEstadoInteraccion, Interaccion } from '../../api/types/servicio'

interface servicioState {
  idServicioActivo?: number,
  idEstadoInteraccionActivo?: IDEstadoInteraccion,
  interaccionActiva?: Interaccion,
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
    interaccionActiva: undefined,
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
    seleccionaInteraccion(state, action) {
      state.interaccionActiva = action.payload
    }
  }
})

export const {
  seleccionaServicio,
  seleccionaEstadoInteraccion,
  toggleCajonFiltros,
  muestraCajonInteraccion,
  escondeCajonInteraccion,
  seleccionaInteraccion,
} = servicioSlice.actions

export default servicioSlice.reducer