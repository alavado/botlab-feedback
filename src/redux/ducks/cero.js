import { createSlice } from "@reduxjs/toolkit"

const ceroSlice = createSlice({
  name: 'enviador',
  initialState: {
    debugging: false
  },
  reducers: {
    activaDebugging(state) {
      state.debugging = true
    },
    desactivaDebugging(state) {
      state.debugging = false
    },
    toggleDebugging(state) {
      state.debugging = !state.debugging
    }
  }
})

export const { activaDebugging, desactivaDebugging, toggleDebugging } = ceroSlice.actions

export default ceroSlice.reducer
