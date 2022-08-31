import { createSlice } from "@reduxjs/toolkit"

const novedadesSlice = createSlice({
  name: 'novedades',
  initialState: {
    vistas: false,
    modalActivo: false,
    tooltipVisible: false,
    modalAlertasDesactivado: false,
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
    },
    desactivaModalAlertas(state) {
      state.modalAlertasDesactivado = true
    }
  }
})

export const {
  activaModal,
  desactivaModal,
  desactivaTooltip,
  desactivaModalAlertas,
} = novedadesSlice.actions

export default novedadesSlice.reducer