const guardarIdEncuestaSeleccionada = 'opciones/guardarEncuestaSeleccionada'

// Por alguna razón siento que es buena idea comentar este reducer

export default function(state = {}, action) {
  switch (action.type) {
    case guardarIdEncuestaSeleccionada: {
      return {
        ...state,
        idEncuestaGuardada: action.payload
      }
    }
    default: return state
  }
}

// Para no tener que volver a seleccionar la encuesta
export const guardaIdEncuesta = id => ({
  type: guardarIdEncuestaSeleccionada,
  payload: id
})