import { createSlice } from "@reduxjs/toolkit"

const slice = createSlice({
  name: 'scrambler',
  initialState: {
    scrambled: false,
    terminos: []
  },
  reducers: {
    escondeDatosSensibles(state, action) {
      state.scrambled = action.payload
    },
    agregaTerminos(state, action) {
      const terminos = action.payload
      if (Array.isArray(terminos[0])) {
        terminos.forEach(t => {
          if (!state.terminos.some(st => st[0] === t[0])) {
            state.terminos.push(t)
          }
        })
      }
    },
    remueveTerminos(state, action) {
      const terminos = action.payload
      if (Array.isArray(terminos[0])) {
        terminos.forEach(t => {
          state.terminos = state.terminos.filter(st => st[0] !== t[0])
        })
      }
    }
  }
})

export const {
  escondeDatosSensibles,
  agregaTerminos,
  remueveTerminos
} = slice.actions

export default slice.reducer
