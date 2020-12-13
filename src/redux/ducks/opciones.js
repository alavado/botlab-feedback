const guardarIdEncuestaSeleccionada = 'opciones/guardarEncuestaSeleccionada'
const fijarChatExpandido = 'opciones/fijarChatExpandido'

const defaultState = {
  chatExpandido: false
}

const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case guardarIdEncuestaSeleccionada: {
      return {
        ...state,
        idEncuestaGuardada: action.payload
      }
    }
    case fijarChatExpandido: {
      return {
        ...state,
        chatExpandido: action.payload
      }
    }
    default: return state
  }
}

export default reducer

export const guardaIdEncuesta = id => ({
  type: guardarIdEncuestaSeleccionada,
  payload: id
})

export const fijaChatExpandido = estado => ({
  type: fijarChatExpandido,
  payload: estado
})