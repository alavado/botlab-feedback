import { YES, NO, REAGENDA, REAGENDADO } from './tags'

const actionSuccess = 'action_result:SUCCESS'
const actionFailure = 'action_result:FAILURE'

const juntarConfirmaYReagenda = (indiceConfirma, indiceReagenda) => {
  return [
    {
      nombre: 'tc1',
      texto: 'Respuesta',
      tipo: 'YESNO',
      f: r => {
        const confirma = r[indiceConfirma]
        const reagenda = r[indiceReagenda]
        if (reagenda?.tag === REAGENDA || reagenda?.tag === YES) {
          return {
            tag: REAGENDA,
            text: `${confirma.text} / ${reagenda.text}`
          }
        }
        return reagenda?.tag ? reagenda : confirma
      }
    }
  ]
}

export const obtenerTagsCalculados = idEncuesta => {
  return (() => {
    switch (idEncuesta) {
      case Number(process.env.REACT_APP_ID_POLL_SANASALUD_CMSC):
        return [
          {
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
            texto: '¿Agenda primera opción?',
            tipo: 'YESNO',
            f: r => r[2]
          },
          {
            texto: 'Fecha preferente',
            tipo: 'OPEN',
            f: r => r[3]
          },
          {
            texto: 'Opción elegida',
            tipo: 'OPEN',
            f: r => r[5]
          },
          {
            texto: '¿Quiere ser llamado?',
            tipo: 'YESNO',
            f: r => r[21].tag ? r[21] : (r[60] || r[21])
          },
          {
            texto: 'Encuesta de satisfacción',
            tipo: 'RANGE',
            f: r => r[-41].tag ? r[-41] : (r[-51] || r[-41])
          }
        ]
      case Number(process.env.REACT_APP_ID_POLL_OREMA):
      case Number(process.env.REACT_APP_ID_POLL_LAS_CRUCES):
      case Number(process.env.REACT_APP_ID_POLL_OYEDENTAL):
      case Number(process.env.REACT_APP_ID_POLL_SONRIE_ARICA):
      case Number(process.env.REACT_APP_ID_POLL_OYEDENTALVINA):
      case Number(process.env.REACT_APP_ID_POLL_AQUAMED):
        return juntarConfirmaYReagenda(0, 1)
      
      case Number(process.env.REACT_APP_ID_POLL_SANTA_BLANCA_RECONFIRMACION):
      case Number(process.env.REACT_APP_ID_POLL_VICHUQUEN):
      case Number(process.env.REACT_APP_ID_POLL_ORTODONCIA_CONCEPCION):
      case Number(process.env.REACT_APP_ID_POLL_ROADENT):
        return juntarConfirmaYReagenda(0, 2)
      
      case Number(process.env.REACT_APP_ID_POLL_FACELAB):
      case Number(process.env.REACT_APP_ID_POLL_VERSALLES):
      case Number(process.env.REACT_APP_ID_POLL_TOBALABA):
      case Number(process.env.REACT_APP_ID_POLL_ALTOSDELVALLE):
      case Number(process.env.REACT_APP_ID_POLL_ANPALEX):
      case Number(process.env.REACT_APP_ID_POLL_ORTODONCIA_CHILE):
      case Number(process.env.REACT_APP_ID_POLL_RUBEN_ROSENBERG):
      case Number(process.env.REACT_APP_ID_POLL_BASU):
        return juntarConfirmaYReagenda(0, 4)
      
      case Number(process.env.REACT_APP_ID_POLL_REDSALUD_GES_CMD_ALAMEDA):
        return [
          {
            texto: 'Respuesta',
            tipo: 'YESNO',
            f: r => {
              if (r[4].tag === REAGENDA || r[4].tag === YES) {
                return { tag: REAGENDA, text: `${r[0].text} / ${r[4].text}` }
              }
              let confirma = r[0]
              if (r[-5].tag) {
                confirma = r[-5]
              }
              return confirma
            }
          }
        ]
      default:
        return
    }
  })()?.map((tag, i) => ({ ...tag, nombre: `tc${i}` }))
}

export const obtenerHeadersConTagsCalculados = (headers, idEncuesta) => {
  const tagsCalculados = obtenerTagsCalculados(idEncuesta)
  if (!tagsCalculados) {
    return
  }
  const headersSinTags = headers.filter(h => !['YESNO', 'RANGE', 'OPEN', 'INTERNAL'].includes(h.tipo))
  return [...tagsCalculados, ...headersSinTags]
}
