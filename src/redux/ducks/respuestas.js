import { diccionarioTags } from "../../helpers/tags"

const fijarRespuestas = 'respuestas/fijarRespuestas'
const fijarFechaInicio = 'respuestas/fijarFechaInicio'
const fijarFechaTermino = 'respuestas/fijarFechaTermino'
const fijarRangoFechas = 'respuestas/fijarRangoFechas'
const fijarBusqueda = 'respuestas/fijarBusqueda'
const fijarRespuesta = 'respuestas/fijarRespuesta'
const limpiarRespuestas = 'respuestas/limpiarRespuestas'
const ordenarRespuestas = 'respuestas/ordenarRespuestas'

const normalizar = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

const defaultState = {
  fechaInicio: new Date(2020, 7, 1),
  fechaTermino: new Date(2020, 7, 2),
  busqueda: '',
  orden: 'ASC'
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
          .reduce((prev, k) => {
            let slug = ''
            if (typeof r[k] === 'string') {
              slug = normalizar(r[k])
            }
            else if (r[k].tag) {
              slug = normalizar(diccionarioTags[r[k].tag].texto)
            }
            return prev + slug
          }, '')
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
    case fijarRangoFechas: {
      const { fechaInicio, fechaTermino } = action.payload
      return {
        ...state,
        fechaInicio,
        fechaTermino
      }
    }
    case fijarBusqueda: {
      const termino = normalizar(action.payload)
      return {
        ...state,
        busqueda: action.payload,
        respuestasVisibles: state.respuestas
          ? state
              .respuestas
              .filter(r => r.respuestaNormalizada.indexOf(termino) >= 0)
          : []
      }
    }
    case fijarRespuesta: {
      return {
        ...state,
        respuestaSeleccionada: action.payload
      }
    }
    case limpiarRespuestas: {
      return {
        ...state,
        respuestas: undefined,
        respuestasVisibles: undefined,
        respuestaSeleccionada: undefined
      }
    }
    case ordenarRespuestas: {
      const header = action.payload
      return {
        ...state,
        respuestas: state.respuestas.slice().sort((r1, r2) => normalizar(r1[header]) < normalizar(r2[header]) ? -1 : 1),
        respuestasVisibles: state.respuestasVisibles.slice().sort((r1, r2) => normalizar(r1[header]) < normalizar(r2[header]) ? -1 : 1)
      }
    }
    default: return state
  }
}

export const limpiaRespuestas = () => ({
  type: limpiarRespuestas
})

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

export const guardaRangoFechas = (fechaInicio, fechaTermino) => ({
  type: fijarRangoFechas,
  payload: { fechaInicio, fechaTermino }
})

export const buscaEsto = termino => ({
  type: fijarBusqueda,
  payload: termino
})

export const guardaEstaRespuesta = respuesta => ({
  type: fijarRespuesta,
  payload: respuesta
})

export const ordenaRespuestas = nombreHeader => ({
  type: ordenarRespuestas,
  payload: nombreHeader
})