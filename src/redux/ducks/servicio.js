import { createSlice } from '@reduxjs/toolkit'

const servicioSlice = createSlice({
  name: 'servicio',
  initialState: {},
  reducers: {
    seleccionaServicio(state, { payload }) {
      state.id = payload
    }
  }
})

export const {
  seleccionaServicio,
} = servicioSlice.actions

export default servicioSlice.reducer