const fijarTiposEncuestas = 'encuestas/fijarTipos'
const fijarHeadersEncuestaSeleccionada = 'encuestas/fijarHeaders'
const fijarHeaders = 'encuestas/fijarTodosLosHeaders'
const limpiarDatos = 'encuestas/limpiarDatos'

const reducer = (state = {}, action) => {
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
    case fijarHeaders: {
      const json = action.payload
      return {
        ...state,
        todosLosHeaders: json.data.data
      }
    }
    case limpiarDatos: {
      return {}
    }
    default: return state
  }
}

export default reducer

export const guardaTiposEncuestas = jsonLogin => ({
  type: fijarTiposEncuestas,
  payload: jsonLogin
})

export const guardaHeadersEncuesta = (id, jsonHeaders) => ({
  type: fijarHeadersEncuestaSeleccionada,
  payload: { id, data: jsonHeaders.data }
})

export const guardaHeaders = json => ({
  type: fijarHeaders,
  payload: json
})

export const limpiaEncuestas = () => ({
  type: limpiarDatos
})