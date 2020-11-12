import { createSelector } from 'reselect'

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
      const { id, data } = action.payload
      let headers = data.data.map(({ name, display_name, type }) => ({
        nombre: name,
        texto: display_name,
        tipo: type
      }))
      return {
        ...state,
        idEncuestaSeleccionada: id,
        headers
      }
    }
    default: return state
  }
}

export const guardaTiposEncuestas = jsonLogin => ({
  type: fijarTiposEncuestas,
  payload: jsonLogin
})

export const guardaHeadersEncuesta = (id, jsonHeaders) => ({
  type: fijarHeadersEncuestaSeleccionada,
  payload: { id, data: jsonHeaders.data }
})
