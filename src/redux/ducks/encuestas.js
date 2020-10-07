const fijarTiposEncuestas = 'encuestas/fijarTipos'
const fijarHeadersEncuestaSeleccionada = 'encuestas/fijarHeaders'

export default function(state = {}, action) {
  switch (action.type) {
    case fijarTiposEncuestas: {
      return {
        ...state,
        tipos: action.payload.polls.map(({ id, name }) => ({
          id,
          nombre: name
        }))
      }
    }
    case fijarHeadersEncuestaSeleccionada: {
      return {
        ...state,
        headers: action.payload.data.data.map(({ name, display_name, type }) => ({
          nombre: name,
          texto: display_name,
          tipo: type
        }))
      }
    }
    default: return state
  }
}

export const guardaTiposEncuestas = jsonLogin => ({
  type: fijarTiposEncuestas,
  payload: jsonLogin
})

export const guardaHeadersEcuesta = jsonHeaders => ({
  type: fijarHeadersEncuestaSeleccionada,
  payload: jsonHeaders
})