import { createSlice } from "@reduxjs/toolkit"

const slice = createSlice({
  name: 'scrambler',
  initialState: {
    scrambled: true
  },
  reducers: {
    escondeDatosSensibles(state, action) {
      state.scrambled = action.payload
    }
  }
})

export const {
  escondeDatosSensibles
} = slice.actions

export default slice.reducer
