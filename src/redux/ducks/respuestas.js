const fijarRespuestas = 'respuestas/fijarRespuestas'
const fijarFechaInicio = 'respuestas/fijarFechaInicio'
const fijarFechaTermino = 'respuestas/fijarFechaTermino'
const fijarBusqueda = 'respuestas/fijarBusqueda'

const defaultState = {
  fechaInicio: new Date(2020, 7, 1),
  fechaTermino: new Date(2020, 7, 2)
  // fechaInicio: Date.now(),
  // fechaTermino: Date.now()
}

export default function(state = defaultState, action) {
  switch (action.type) {
    case fijarRespuestas: {
      const jsonRespuestas = action.payload
      const respuestas = jsonRespuestas.data.data.map(r => {
        const [dia,, nombreMes] = r.date.split(' ')
        const fecha = `${dia} ${nombreMes.slice(0, 3)}. ${r.time}`
        const respuestaNormalizada = Object.keys(r)
          .reduce((prev, k) => typeof r[k] === 'string' ? (prev + ' ' + r[k].normalize('NFD').replace(/[\u0300-\u036f]/g, '')) : prev, '').toLowerCase()
        return {
          ...r,
          fecha,
          respuestaNormalizada
        }
      })
      return {
        ...state,
        respuestas,
        respuestasVisibles: respuestas
      }
    }
    case fijarFechaInicio: {
      return {
        ...state,
        fechaInicio: action.payload
      }
    }
    case fijarFechaTermino: {
      return {
        ...state,
        fechaTermino: action.payload
      }
    }
    case fijarBusqueda: {
      const termino = action.payload.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
      return {
        ...state,
        respuestasVisibles: state.respuestas.filter(r => r.respuestaNormalizada.indexOf(termino) >= 0)
      }
    }
    default: return state
  }
}

export const guardaRespuestas = jsonRespuestas => ({
  type: fijarRespuestas,
  payload: jsonRespuestas
})

export const guardaFechaInicio = fecha => ({
  type: fijarFechaInicio,
  payload: fecha
})

export const guardaFechaTermino = fecha => ({
  type: fijarFechaTermino,
  payload: fecha
})

export const buscaEsto = termino => ({
  type: fijarBusqueda,
  payload: termino
})