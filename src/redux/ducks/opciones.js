const guardarEncuestaSeleccionada = 'opciones/guardarEncuestaSeleccionada'

export default function(state = {}, action) {
  switch (action.payload) {
    case guardarEncuestaSeleccionada: {
      return state
    }
    default: return state
  }
}