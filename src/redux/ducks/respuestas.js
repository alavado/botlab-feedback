

const fijarRespuestas = 'respuestas/fijarRespuestas'
const fijarFechaInicio = 'respuestas/fijarFechaInicio'
const fijarFechaTermino = 'respuestas/fijarFechaTermino'

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
      return {
        ...state,
        respuestas: jsonRespuestas.data.data.map(r => {
          const [dia,, nombreMes] = r.date.split(' ')
          const fecha = `${dia} ${nombreMes.slice(0, 3)}. ${r.time}`
          delete r.dia
          delete r.nombreMes
          return {
            ...r,
            fecha
          }
        })
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