import { YES, NO, REAGENDA, REAGENDADO } from './tags'

const actionSuccess = 'action_result:SUCCESS'
const actionFailure = 'action_result:FAILURE'

const encuestas = [
  {
    idEncuesta: Number(process.env.REACT_APP_ID_POLL_SANASALUD_CMSC),
    comentario: 'Encuesta piloto de reagendamiento automático con Sanasalud',
    tagsCalculados: [
      {
        nombre: 'tc1',
        texto: 'Respuesta',
        tipo: 'YESNO',
        f: r => {
          if (r[7]?.tag) {
            return { tag: NO, texto: 'Usuario cancela post interacción' }
          }
          if ([r[11]?.tag, r[12]?.tag, r[13]?.tag].includes(actionSuccess)) {
            return { tag: REAGENDA, texto: 'Reagendamiento exitoso' }
          }
          if (r[2]?.tag === REAGENDA || r[2]?.tag === YES) {
            return { tag: REAGENDA, texto: 'Reagendamiento en curso' }
          }
          return r[0]//{ tag: REAGENDADO, texto: 'Reagendamiento exitoso' }
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
