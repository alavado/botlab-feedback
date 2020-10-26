const guardarIdEncuestaSeleccionada = 'opciones/guardarEncuestaSeleccionada'
const toggleColapsoColumna = 'opciones/toggleColapsoColumna'

// Por alguna razón siento que es buena idea comentar este reducer
const defaultState = {
  columnasColapsadas: [{
    idEncuesta: -1,
    columnasColapsadas: []
  }]
}

export default function(state = defaultState, action) {
  switch (action.type) {
    case guardarIdEncuestaSeleccionada: {
      return {
        ...state,
        idEncuestaGuardada: action.payload
      }
    }
    case toggleColapsoColumna: {
      const { idEncuesta, nombreColumna } = action.payload
      const encuesta = state.columnasColapsadas.find(c => c.idEncuesta === idEncuesta)
      if (!encuesta) {
        return {
          ...state,
          columnasColapsadas: [
            ...state.columnasColapsadas,
            {
              idEncuesta,
              columnasColapsadas: [nombreColumna]
            }
          ]
        }
      }
      const estabaColapsada = encuesta.columnasColapsadas.indexOf(nombreColumna) >= 0
      return {
        ...state,
        columnasColapsadas: [
          ...state.columnasColapsadas.filter(e => e.idEncuesta !== idEncuesta),
          {
            idEncuesta,
            columnasColapsadas: estabaColapsada
              ? encuesta.columnasColapsadas.filter(n => n !== nombreColumna)
              : [...encuesta.columnasColapsadas, nombreColumna]
          }
        ]
      }
    }
    default: return state
  }
}

// Para no tener que volver a seleccionar la encuesta
export const guardaIdEncuesta = id => ({
  type: guardarIdEncuestaSeleccionada,
  payload: id
})

// Para colapsar columnas de encuestas
export const toggleaColapsoColumna = (idEncuesta, nombreColumna) => ({
  type: toggleColapsoColumna,
  payload: { idEncuesta, nombreColumna }
})