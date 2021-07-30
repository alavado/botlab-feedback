const actionSuccess = 'action_result:SUCCESS'
const actionFailure = 'action_result:FAILURE'

const encuestas = [
  {
    idEncuesta: 213,
    tagsCalculados: [
      {
        nombre: 'hc0',
        texto: '¿Confirma?',
        tipo: 'YESNO',
        f: r => {
          if (r[6]?.tag) {
            return { tag: 'NO', texto: 'Usuario cancela post interacción' }
          }
          if ([r[3]?.tag, r[4]?.tag, r[5]?.tag].includes(actionSuccess)) {
            return { tag: 'YES', texto: 'Reagendamiento automático' }
          }
          return r[0]
        }
      },
      {
        nombre: 'hc1',
        texto: '¿Reagenda?',
        tipo: 'YESNO',
        f: r => {
          if (r[6]?.tag) {
            return { tag: 'NO', texto: 'Usuario cancela post interacción' }
          }
          if ([r[3]?.tag, r[4]?.tag, r[5]?.tag].includes(actionSuccess)) {
            return { tag: 'YES', texto: 'Reagendamiento automático' }
          }
          return r[2]
        }
      }
    ]
  }
]

export const obtenerHeadersConTagsCalculados = (headers, idEncuesta) => {
  const tagsCalculados = encuestas.find(e => e.idEncuesta === idEncuesta)?.tagsCalculados
  if (!tagsCalculados) {
    return
  }
  const headersSinTags = headers.filter(h => !['YESNO', 'RANGE', 'OPEN', 'INTERNAL'].includes(h.tipo))
  return [...tagsCalculados, ...headersSinTags]
}