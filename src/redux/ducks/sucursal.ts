import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface sucursalState {
  nombreSucursalActiva?: string,
}

const sucursalesSlice = createSlice({
  name: 'servicio',
  initialState: {
    nombreSucursalActiva: undefined
  } as sucursalState,
  reducers: {
    seleccionaSucursal(state, action: PayloadAction<string | undefined>) {
      state.nombreSucursalActiva = action.payload
    },
  }
})

export const {
  seleccionaSucursal,
} = sucursalesSlice.actions

export default sucursalesSlice.reducer