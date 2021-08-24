import { YES, NO, REAGENDA, REAGENDADO } from './tags'

const actionSuccess = 'action_result:SUCCESS'
const actionFailure = 'action_result:FAILURE'

export const obtenerTagsCalculados = idEncuesta => {
  switch (idEncuesta) {
    case Number(process.env.REACT_APP_ID_POLL_SANASALUD_CMSC):
      return [
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
    case Number(process.env.REACT_APP_ID_POLL_REDSALUD_BLOQUEO_EGT2H):
    case Number(process.env.REACT_APP_ID_POLL_REDSALUD_BLOQUEO_ELEQ2H):
    case Number(process.env.REACT_APP_ID_POLL_REDSALUD_BLOQUEO_NE):
      return [
        {
          nombre: 'tc1',
          texto: '¿Agenda primera opción?',
          tipo: 'YESNO',
          f: r => r[2]
        },
        {
          nombre: 'tc2',
          texto: 'Fecha preferente',
          tipo: 'OPEN',
          f: r => r[3]
        },
        {
          nombre: 'tc3',
          texto: 'Opción elegida',
          tipo: 'OPEN',
          f: r => r[5]
        },
        {
          nombre: 'tc4',
          texto: '¿Quiere ser llamado?',
          tipo: 'YESNO',
          f: r => r[21].tag ? r[21] : (r[60] || r[21])
        },
        {
          nombre: 'tc5',
          texto: 'Encuesta de satisfacción',
          tipo: 'RANGE',
          f: r => r[-41].tag ? r[-41] : (r[-51] || r[-41])
        }
      ]
    case Number(process.env.REACT_APP_ID_POLL_AQUAMED):
    case Number(process.env.REACT_APP_ID_POLL_ALTOSDELVALLE):
      return [
        {
          nombre: 'tc1',
          texto: 'Respuesta',
          tipo: 'YESNO',
          f: r => {
            if (r[1].tag === REAGENDA || r[1].tag === YES) {
              return { tag: REAGENDA, text: `${r[0].text} / ${r[1].text}` }
            }
            if (r[1].tag) {
              return r[1]
            }
            return r[0]
          }
        }
      ]
    case Number(process.env.REACT_APP_ID_POLL_SANTA_BLANCA_RECONFIRMACION):
    case Number(process.env.REACT_APP_ID_POLL_VICHUQUEN):
    case Number(process.env.REACT_APP_ID_POLL_ORTODONCIA_CONCEPCION):
      return [
        {
          nombre: 'tc1',
          texto: 'Respuesta',
          tipo: 'YESNO',
          f: r => {
            if (r[2].tag === REAGENDA || r[2].tag === YES) {
              return { tag: REAGENDA, text: `${r[0].text} / ${r[2].text}` }
            }
            if (r[2].tag) {
              return r[2]
            }
            return r[0]
          }
        }
      ]
    case Number(process.env.REACT_APP_ID_POLL_REDSALUD_GES_CMD_ALAMEDA):
      return [
        {
          nombre: 'tc1',
          texto: 'Respuesta',
          tipo: 'YESNO',
          f: r => {
            if (r[4].tag === REAGENDA || r[4].tag === YES) {
              return { tag: REAGENDA, text: `${r[0].text} / ${r[4].text}` }
            }
            let tagConfirma = r[0]
            if (r[-5].tag) {
              tagConfirma = r[-5]
            }
            return tagConfirma
          }
        }
      ]
    default:
      return
  }
}

export const obtenerHeadersConTagsCalculados = (headers, idEncuesta) => {
  const tagsCalculados = obtenerTagsCalculados(idEncuesta)
  if (!tagsCalculados) {
    return
  }
  const headersSinTags = headers.filter(h => !['YESNO', 'RANGE', 'OPEN', 'INTERNAL'].includes(h.tipo))
  return [...tagsCalculados, ...headersSinTags]
}
