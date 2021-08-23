import { createSlice } from "@reduxjs/toolkit"

const alertasSlice = createSlice({
  name: 'alertas',
  initialState: {
    alertas: []
  },
  reducers: {
    guardaAlertas(state, action) {
      state.alertas = action.payload.data.reverse()
    }
  }
})

export const { guardaAlertas } = alertasSlice.actions

export default alertasSlice.reducer
