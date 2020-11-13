const fijarResultadosBusqueda = 'busqueda/fijarResultadosBusqueda'
const limpiarResultadosBusqueda = 'busqueda/limpiarResultadosBusqueda'
const comenzarBusqueda = 'busqueda/comenzarBusqueda'

const defaultState = {
  resultadosBusqueda: undefined,
  buscando: false
}

export default function(state = defaultState, action) {
  switch (action.type) {
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