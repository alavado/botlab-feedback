import {
  YES,
  NO,
  REAGENDA,
  AGENDA_OPCION_1,
  AGENDA_OPCION_2,
  AGENDA_OPCION_3,
} from './tags'

const actionSuccess = 'action_result:SUCCESS'
// const actionFailure = 'action_result:FAILURE'

export const juntarConfirmaYReagenda = (indiceConfirma, indiceReagenda) => {
  return [
    {
      nombre: 'tc1',
      texto: 'Respuesta',
      tipo: 'YESNO',
      f: (r) => {
        const confirma = r[indiceConfirma]
        const reagenda = r[indiceReagenda]
        if (reagenda?.tag === REAGENDA || reagenda?.tag === YES) {
          return {
            tag: REAGENDA,
            text: `${confirma.text} / ${reagenda.text}`,
          }
        }
        return reagenda?.tag ? reagenda : confirma
      },
    },
  ]
}

export const obtenerTagsCalculados = (idEncuesta) => {
  return (() => {
    const fechaCambioMapping = '2022-03-18'
    switch (idEncuesta) {
      case 635: // lista de espera hbv
        return [
          {
            texto: 'Confirma?',
            tipo: 'YESNO',
            f: (r) => r[0],
          },
          {
            texto: '¿Se arrepiente?',
            tipo: 'OPEN',
            f: (r) =>
              r[2].tag === 'NO_CANCELAR'
                ? {
                    tag: 'DEFAULT',
                    text: r[2].text,
                  }
                : null,
          },
        ]
      case 557: // agendamiento norden
        return [
          {
            texto: '¿Menor de edad?',
            tipo: 'YESNO',
            f: (r) => r[13],
          },
          {
            texto: 'Mensaje Inicial',
            tipo: 'OPEN',
            f: (r) => r[0],
          },
          {
            texto: 'Encontramos horas',
            tipo: 'INTERNAL',
            f: (r) => r[2],
          },
          {
            texto: 'Opción elegida',
            tipo: 'OPEN',
            f: (r) => r[3],
          },
          {
            texto: 'Bloque agendado',
            tipo: 'INTERNAL',
            f: (r) => {
              if (r[610]?.tag === actionSuccess) {
                return {
                  tag: AGENDA_OPCION_1,
                  texto: 'Bloque 1',
                }
              }
              if (r[620]?.tag === actionSuccess) {
                return {
                  tag: AGENDA_OPCION_2,
                  texto: 'Bloque 2',
                }
              }
              if (r[630]?.tag === actionSuccess) {
                return {
                  tag: AGENDA_OPCION_3,
                  texto: 'Bloque 3',
                }
              }
            },
          },
        ]
      case 577: // agendamiento everest
        return [
          {
            texto: '¿Menor de edad?',
            tipo: 'YESNO',
            f: (r) => r[13],
          },
          {
            texto: 'Mensaje Inicial',
            tipo: 'OPEN',
            f: (r) => r[0],
          },
          {
            texto: 'Encontramos horas',
            tipo: 'INTERNAL',
            f: (r) => r[2],
          },
          {
            texto: 'Opción elegida',
            tipo: 'OPEN',
            f: (r) => r[3],
          },
          {
            texto: 'Bloque agendado',
            tipo: 'INTERNAL',
            f: (r) => {
              if (r[510]?.tag === actionSuccess) {
                return {
                  tag: AGENDA_OPCION_1,
                  texto: 'Bloque 1',
                }
              }
              if (r[520]?.tag === actionSuccess) {
                return {
                  tag: AGENDA_OPCION_2,
                  texto: 'Bloque 2',
                }
              }
              if (r[530]?.tag === actionSuccess) {
                return {
                  tag: AGENDA_OPCION_3,
                  texto: 'Bloque 3',
                }
              }
            },
          },
        ]
      case 892: // agendamiento nucleo
        return [
          {
            texto: 'Mensaje Inicial',
            tipo: 'OPEN',
            f: (r) => r[0],
          },
          {
            texto: 'Encontramos horas',
            tipo: 'INTERNAL',
            f: (r) => r[4],
          },
          {
            texto: 'Opción elegida',
            tipo: 'OPEN',
            f: (r) => r[5],
          },
          {
            texto: 'Bloque agendado',
            tipo: 'INTERNAL',
            f: (r) => {
              if (r[61]?.tag === actionSuccess) {
                return {
                  tag: AGENDA_OPCION_1,
                  texto: 'Bloque 1',
                }
              }
              if (r[62]?.tag === actionSuccess) {
                return {
                  tag: AGENDA_OPCION_2,
                  texto: 'Bloque 2',
                }
              }
              if (r[63]?.tag === actionSuccess) {
                return {
                  tag: AGENDA_OPCION_3,
                  texto: 'Bloque 3',
                }
              }
              if (r[64]?.tag === actionSuccess) {
                return {
                  tag: AGENDA_OPCION_3,
                  texto: 'Bloque 3',
                }
              }
              if (r[65]?.tag === actionSuccess) {
                return {
                  tag: AGENDA_OPCION_3,
                  texto: 'Bloque 3',
                }
              }
            },
          },
        ]
      case 509: // SS agendamiento
        return [
          {
            texto: 'Mensaje Inicial',
            tipo: 'OPEN',
            f: (r) => r[0],
          },
          {
            texto: 'Encontramos horas',
            tipo: 'INTERNAL',
            f: (r) => r[3],
          },
          {
            texto: 'Opción elegida',
            tipo: 'OPEN',
            f: (r) => r[4],
          },
          {
            texto: 'Bloque agendado',
            tipo: 'INTERNAL',
            f: (r) => {
              if (r[61]?.tag === actionSuccess) {
                return {
                  tag: AGENDA_OPCION_1,
                  texto: 'Bloque 1',
                }
              }
              if (r[62]?.tag === actionSuccess) {
                return {
                  tag: AGENDA_OPCION_2,
                  texto: 'Bloque 2',
                }
              }
              if (r[63]?.tag === actionSuccess) {
                return {
                  tag: AGENDA_OPCION_3,
                  texto: 'Bloque 3',
                }
              }
              if (r[64]?.tag === actionSuccess) {
                return {
                  tag: AGENDA_OPCION_3,
                  texto: 'Bloque 3',
                }
              }
              if (r[65]?.tag === actionSuccess) {
                return {
                  tag: AGENDA_OPCION_3,
                  texto: 'Bloque 3',
                }
              }
            },
          },
        ]
      case Number(process.env.REACT_APP_ID_POLL_SANASALUD_CMSC):
        return [
          {
            texto: 'Respuesta',
            tipo: 'YESNO',
            f: (r) => {
              if (r[7]?.tag) {
                return { tag: NO, texto: 'Usuario cancela post interacción' }
              }
              if (
                [r[11]?.tag, r[12]?.tag, r[13]?.tag].includes(actionSuccess)
              ) {
                return { tag: REAGENDA, texto: 'Reagendamiento exitoso' }
              }
              if (r[2]?.tag === REAGENDA || r[2]?.tag === YES) {
                return { tag: REAGENDA, texto: 'Reagendamiento en curso' }
              }
              return r[0] //{ tag: REAGENDADO, texto: 'Reagendamiento exitoso' }
            },
          },
        ]
      case Number(process.env.REACT_APP_ID_POLL_REDSALUD_BLOQUEO_EGT2H):
      case Number(process.env.REACT_APP_ID_POLL_REDSALUD_BLOQUEO_ELEQ2H):
      case Number(process.env.REACT_APP_ID_POLL_REDSALUD_BLOQUEO_NE):
        return [
          {
            texto: '¿Agenda primera opción?',
            tipo: 'YESNO',
            f: (r) => r[2],
          },
          {
            texto: 'Fecha preferente',
            tipo: 'OPEN',
            f: (r) => r[3],
          },
          {
            texto: 'Opción elegida',
            tipo: 'OPEN',
            f: (r) => r[5],
          },
          {
            texto: '¿Quiere ser llamado?',
            tipo: 'YESNO',
            f: (r) => (r[21].tag ? r[21] : r[60] || r[21]),
          },
          {
            texto: 'Encuesta de satisfacción',
            tipo: 'RANGE',
            f: (r) => (r[-41].tag ? r[-41] : r[-51] || r[-41]),
          },
        ]
      case Number(process.env.REACT_APP_ID_POLL_FALP_CONVENIOS):
        return [
          {
            texto: '¿Dirección?',
            tipo: 'YESNO',
            f: (r) => (r.start < fechaCambioMapping ? r[0] : r[0]),
          },
          {
            texto: 'Pedir dirección correcta',
            tipo: 'OPEN',
            f: (r) => (r.start < fechaCambioMapping ? r[10] : r[10]),
          },
          {
            texto: '¿Email?',
            tipo: 'OPEN',
            f: (r) => (r.start < fechaCambioMapping ? r[1] : r[2]),
          },
          {
            texto: 'Pedir email correcto',
            tipo: 'OPEN',
            f: (r) => (r.start < fechaCambioMapping ? r[11] : r[12]),
          },
          {
            texto: '¿Prevision?',
            tipo: 'YESNO',
            f: (r) => (r.start < fechaCambioMapping ? r[2] : r[3]),
          },
          {
            texto: 'Pedir previsión correcta',
            tipo: 'OPEN',
            f: (r) => (r.start < fechaCambioMapping ? r[12] : r[13]),
          },
        ]

      case Number(process.env.REACT_APP_ID_POLL_SANASALUD_KOPLAND_T5):
        return [
          {
            texto: '¿Confirma?',
            tipo: 'YESNO',
            f: (r) => r[0],
          },
          {
            texto: 'Reagenda',
            tipo: 'YESNO',
            f: (r) => r[1],
          },
          {
            texto: '¿Por qué no?',
            tipo: 'OPEN',
            f: (r) => r[-15],
          },
          {
            texto: '¿Por qué no?',
            tipo: 'OPEN',
            f: (r) => r[-16],
          },
        ]

      case Number(process.env.REACT_APP_ID_POLL_REDSALUD_GES_CMD_ALAMEDA):
        return [
          {
            texto: 'Respuesta',
            tipo: 'YESNO',
            f: (r) => {
              if (r[4].tag === REAGENDA || r[4].tag === YES) {
                return { tag: REAGENDA, text: `${r[0].text} / ${r[4].text}` }
              }
              let confirma = r[0]
              if (r[-5].tag) {
                confirma = r[-5]
              }
              return confirma
            },
          },
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
  const headersSinTags = headers
    .filter((h) => !['YESNO', 'RANGE', 'OPEN', 'INTERNAL'].includes(h.tipo))
    .map((h) =>
      h.texto.includes(' Externo') ? { ...h, texto: h.texto.slice(0, -8) } : h
    )
  return [...tagsCalculados, ...headersSinTags]
}
