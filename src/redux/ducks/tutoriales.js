import { createSlice } from "@reduxjs/toolkit"

const tutorialesSlice = createSlice({
  name: 'tutoriales',
  initialState: {
    visto: false,
  },
  reducers: {
    marcaVisto(state) {
      state.visto = true
    },
  }
})

export const {
  marcaVisto,
} = tutorialesSlice.actions

export default tutorialesSlice.reducer