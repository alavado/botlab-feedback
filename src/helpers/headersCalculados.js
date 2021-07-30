const actionSuccess = 'action_result:SUCCESS'
const actionFailure = 'action_result:FAILURE'

const encuestas = [
  {
    idEncuesta: 213,
    headersCalculados: [
      {
        nombre: 'hc0',
        texto: '¿Confirma?',
        tipo: 'YESNO',
        f: r => {
          if (r[7]?.tag) {
            return { tag: 'NO' }
          }
          if ([r[3]?.tag, r[4]?.tag, r[5]?.tag].includes(actionSuccess)) {
            return { tag: 'YES' }
          }
          return r[0]
        }
      },
      {
        nombre: 'hc1',
        texto: '¿Reagenda?',
        tipo: 'YESNO',
        f: r => {
          if (r[7]?.tag) {
            return { tag: 'NO' }
          }
          if ([r[3]?.tag, r[4]?.tag, r[5]?.tag].includes(actionSuccess)) {
            return { tag: 'YES' }
          }
          return r[2]
        }
      }
    ]
  }
]

// Si hay headers calculados, solo se consideran esos tags
export const obtenerHeadersCalculados = (headers, idEncuesta) => {
  const encuesta = encuestas.find(e => e.idEncuesta === idEncuesta)
  if (!encuesta) {
    return
  }
  return [
    ...encuesta.headersCalculados,
    ...headers.filter(h => !['YESNO', 'RANGE', 'OPEN', 'INTERNAL'].includes(h.tipo))
  ]
}