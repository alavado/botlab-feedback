const fijarRespuestas = 'respuestas/fijarRespuestas'
const fijarFechaInicio = 'respuestas/fijarFechaInicio'
const fijarFechaTermino = 'respuestas/fijarFechaTermino'
const fijarBusqueda = 'respuestas/fijarBusqueda'
const fijarRespuesta = 'respuestas/fijarRespuesta'

const normalizar = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

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
          .reduce((prev, k) => typeof r[k] === 'string' ? (prev + ' ' + normalizar(r[k])) : prev, '')
        return {
          ...r,
          fecha,
          respuestaNormalizada
        }
      }).reverse()
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
      const termino = normalizar(action.payload)
      return {
        ...state,
        respuestasVisibles: state
          .respuestas
          .filter(r => r.respuestaNormalizada.indexOf(termino) >= 0)
      }
    }
    case fijarRespuesta: {
      return {
        ...state,
        respuestaSeleccionada: action.payload
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

export const guardaEstaRespuesta = respuesta => ({
  type: fijarRespuesta,
  payload: respuesta
})