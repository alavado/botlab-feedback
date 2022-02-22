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
      },
      {
        emoji: '📱',
        comentario: 'hora reagendada por teléfono'
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
  }
})

export const {
  guardaReaccion
} = reaccionesSlice.actions

export default reaccionesSlice.reducer
