import { createSlice } from "@reduxjs/toolkit"

const alertasSlice = createSlice({
  name: 'alertas',
  initialState: {
    idAlertaDestacada: undefined
  },
  reducers: {
    destacarAlerta(state, { payload: { id } }) {
      state.idAlertaDestacada = id
    },
  }
})

export const { destacarAlerta } = alertasSlice.actions

export default alertasSlice.reducer
