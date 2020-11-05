const fijarTermino = 'busqueda/fijarTermino'
const fijarResultadosBusqueda = 'busqueda/fijarResultadosBusqueda'
const limpiarResultadosBusqueda = 'busqueda/limpiarResultadosBusqueda'

const defaultState = {
  resultadosBusqueda: [],
  termino: ''
}

export default function(state = defaultState, action) {
  switch (action.type) {
    case fijarTermino: {
      return {
        ...state,
        termino: action.payload
      }
    }
    case fijarResultadosBusqueda: {
      const json = action.payload
      const resultados = json.data
      return {
        ...state,
        resultadosBusqueda: resultados
      }
    }
    case limpiarResultadosBusqueda: {
      return defaultState
    }
    default: return state
  }
}

export const guardaTermino = termino => ({
  type: fijarTermino,
  payload: termino
})

export const guardaResultadosBusqueda = json => ({
  type: fijarResultadosBusqueda,
  payload: json
})

export const limpiaBusqueda = () => ({
  type: limpiarResultadosBusqueda
})