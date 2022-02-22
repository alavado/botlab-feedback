import { createSlice } from "@reduxjs/toolkit"

const reaccionesSlice = createSlice({
  name: 'opciones',
  initialState: {
    reaccionesGuardadas: [
      {
        emoji: '✅',
        comentario: 'ya contactamos a paciente'
      },
      {
        emoji: '⏳',
        comentario: 'paciente no contesta'
      }
    ]
  },
  reducers: {
    guardaReaccion(state, action) {
      const { comentario, emoji } = action.payload
      const indiceReaccionConMismoComentario = state.reaccionesGuardadas.findIndex(r => r.comentario === comentario)
      if (indiceReaccionConMismoComentario < 0) {
        state.reaccionesGuardadas = [{ comentario, emoji }, ...state.reaccionesGuardadas]
      }
      else {
        state.reaccionesGuardadas[indiceReaccionConMismoComentario].emoji = emoji
      }
    },
    eliminaReaccion(state, action) {
      const comentario = action.payload
      const indiceReaccionConMismoComentario = state.reaccionesGuardadas.findIndex(r => r.comentario === comentario)
      state.reaccionesGuardadas = state.reaccionesGuardadas.filter((_, i) => i !== indiceReaccionConMismoComentario)
    },
  }
})

export const {
  guardaReaccion,
  eliminaReaccion
} = reaccionesSlice.actions

export default reaccionesSlice.reducer
