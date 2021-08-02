const actionSuccess = 'action_result:SUCCESS'
const actionFailure = 'action_result:FAILURE'

const encuestas = [
  {
    idEncuesta: 213,
    comentario: 'Esta encuesta no existe',
    tagsCalculados: [
      {
        nombre: 'tc1',
        texto: '¿Confirma?',
        tipo: 'YESNO',
        f: r => {
          if (r[7]?.tag) {
            return { tag: 'NO', texto: 'Usuario cancela post interacción' }
          }
          if ([r[11]?.tag, r[12]?.tag, r[13]?.tag].includes(actionSuccess)) {
            return { tag: 'REAGENDA', texto: 'Reagendamiento automático' }
          }
          return r[0]
        }
      },
      {
        nombre: 'tc2',
        texto: '¿Reagenda?',
        tipo: 'YESNO',
        f: r => {
          if ([r[11]?.tag, r[12]?.tag, r[13]?.tag].includes(actionSuccess)) {
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
