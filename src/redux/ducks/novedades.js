import { createSlice } from "@reduxjs/toolkit"

const novedadesSlice = createSlice({
  name: 'novedades',
  initialState: {
    vistas: false,
    modalActivo: false,
    tooltipVisible: true
  },
  reducers: {
    activaModal(state) {
      state.modalActivo = true
    },
    desactivaModal(state) {
      state.modalActivo = false
    },
    desactivaTooltip(state) {
      state.tooltipVisible = false
    }
  }
})

export const {
  activaModal,
  desactivaModal,
  desactivaTooltip
} = novedadesSlice.actions

export default novedadesSlice.reducer