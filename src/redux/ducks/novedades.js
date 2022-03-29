import { createSlice } from "@reduxjs/toolkit"

const novedadesSlice = createSlice({
  name: 'novedades',
  initialState: {
    vistas: false,
    modalActivo: false
  },
  reducers: {
    activaModal(state) {
      state.modalActivo = true
    },
    desactivaModal(state) {
      state.modalActivo = false
    },
  }
})

export const {
  activaModal,
  desactivaModal
} = novedadesSlice.actions

export default novedadesSlice.reducer