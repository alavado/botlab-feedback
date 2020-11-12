const fijarTermino = 'busqueda/fijarTermino'
const fijarResultadosBusqueda = 'busqueda/fijarResultadosBusqueda'
const limpiarResultadosBusqueda = 'busqueda/limpiarResultadosBusqueda'
const comenzarBusqueda = 'busqueda/comenzarBusqueda'

const defaultState = {
  resultadosBusqueda: undefined,
  termino: '',
  buscando: false
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
        resultadosBusqueda: resultados,
        buscando: false
      }
    }
    case comenzarBusqueda: {
      return {
        ...state,
        buscando: true
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

export const comienzaBusqueda = () => ({
  type: comenzarBusqueda
})

export const limpiaBusqueda = () => ({
  type: limpiarResultadosBusqueda
})