import { createSlice } from "@reduxjs/toolkit"

const configuracionSlice = createSlice({
  name: 'configuracion',
  initialState: {
    modalVisible: false
  },
  reducers: {
    muestraModal(state) {
      state.modalVisible = true
    },
    escondeModal(state) {
      state.modalVisible = false
    },
  }
})

export const { muestraModal, escondeModal } = configuracionSlice.actions

export default configuracionSlice.reducer