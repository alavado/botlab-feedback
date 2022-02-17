import { YES, NO, REAGENDA } from './tags'

const actionSuccess = 'action_result:SUCCESS'
// const actionFailure = 'action_result:FAILURE'

export const juntarConfirmaYReagenda = (indiceConfirma, indiceReagenda) => {
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

const juntarConfirmaYReagendaAutomatico = (indiceConfirma, indiceReagenda, indiceReagendaAuto) => {
  return [
    {
      nombre: 'tc1',
      texto: '¿Confirma?',
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
      },
    },
    {
      nombre: 'tc2',
      texto: '¿Reagenda?',
      tipo: 'OPEN',
      f: r => r[indiceReagendaAuto]
    }
  ]
}

const juntaTagsEquivalentes = (indice1, indice2, texto, tipo = 'YESNO') => {
  return [
    {
      nombre: 'tc0',
      texto,
      tipo,
      f: r => {
        const tag1 = r[indice1]
        const tag2 = r[indice2]
        return tag1?.tag ? tag1 : tag2
      },
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
      
      case Number(process.env.REACT_APP_ID_POLL_REDSALUD_LISTA_DE_ESPERA_2):
        return juntaTagsEquivalentes(100, 101, '¿Agenda?')

      case Number(process.env.REACT_APP_ID_POLL_OREMA):
      case Number(process.env.REACT_APP_ID_POLL_LAS_CRUCES):
      case Number(process.env.REACT_APP_ID_POLL_OYEDENTAL):
      case Number(process.env.REACT_APP_ID_POLL_OYEDENTALVINA):
      case Number(process.env.REACT_APP_ID_POLL_ACHS):
        return juntarConfirmaYReagenda(0, 1)
      
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
      case Number(process.env.REACT_APP_ID_POLL_DENTAL_SPA_CHILE):
      case Number(process.env.REACT_APP_ID_POLL_AQUAMED):
      case Number(process.env.REACT_APP_ID_POLL_SONRIE_ARICA):
      case Number(process.env.REACT_APP_ID_POLL_SANTA_BLANCA_RECONFIRMACION):
      case Number(process.env.REACT_APP_ID_POLL_MEDISIS):
      case Number(process.env.REACT_APP_ID_POLL_AYVDENTAL):
      case Number(process.env.REACT_APP_ID_POLL_AYVDENTAL_2):
      case Number(process.env.REACT_APP_ID_POLL_DENTALONE):
      case Number(process.env.REACT_APP_ID_POLL_3DENTONCE16):
      case Number(process.env.REACT_APP_ID_POLL_NATURALDENT):
      case Number(process.env.REACT_APP_ID_POLL_EZIOCHIAPPE):
      case Number(process.env.REACT_APP_ID_POLL_CDC):
      case Number(process.env.REACT_APP_ID_POLL_ALTOTOBALABA):
        return juntarConfirmaYReagenda(0, 4)
      
      case Number(process.env.REACT_APP_ID_POLL_AYVDENTAL_RECONFIRMACION):
      case Number(process.env.REACT_APP_ID_POLL_OYEDENTAL_RECONFIRMACION):
      case Number(process.env.REACT_APP_ID_POLL_VENTUS_RECONFIRMACION):
      case Number(process.env.REACT_APP_ID_POLL_SANTIS_RECONFIRMACION):
      case Number(process.env.REACT_APP_ID_POLL_OAS_RECONFIRMACION):
        return juntarConfirmaYReagenda(50, 104)
      
      case Number(process.env.REACT_APP_ID_POLL_ODONTOS):
      case Number(process.env.REACT_APP_ID_POLL_VENTUS):
      case Number(process.env.REACT_APP_ID_POLL_SANTIS):
      case Number(process.env.REACT_APP_ID_POLL_ALPHA_SALUD_BIO_BIO):
      case Number(process.env.REACT_APP_ID_POLL_DENTAL_MAS):
      case Number(process.env.REACT_APP_ID_POLL_DENTAL_MAS_MXL):
      case Number(process.env.REACT_APP_ID_POLL_DENTAL_MAS_JWARNER):
      case Number(process.env.REACT_APP_ID_POLL_SPA_DENTAL):
      case Number(process.env.REACT_APP_ID_POLL_UDENT):
      case Number(process.env.REACT_APP_ID_POLL_VITALIA):
      case Number(process.env.REACT_APP_ID_POLL_OAS):
      case Number(process.env.REACT_APP_ID_POLL_EDERNA):
      case Number(process.env.REACT_APP_ID_POLL_DENT_ALL_CLEAR):
      case Number(process.env.REACT_APP_ID_POLL_BOKA):
      case Number(process.env.REACT_APP_ID_POLL_COEPEJ):
      case Number(process.env.REACT_APP_ID_POLL_EFIDENT):
      case Number(process.env.REACT_APP_ID_POLL_BELADENT):
      case Number(process.env.REACT_APP_ID_POLL_MARCHESANI):
      case Number(process.env.REACT_APP_ID_POLL_CERRO_BLANCO):
      case Number(process.env.REACT_APP_ID_POLL_SMILE_DESIGN):
      case Number(process.env.REACT_APP_ID_POLL_BRACKET_CENTER):
      case Number(process.env.REACT_APP_ID_POLL_DENTALSKI):
      case Number(process.env.REACT_APP_ID_POLL_BEHAPPY):
      case Number(process.env.REACT_APP_ID_POLL_CRD):
      case Number(process.env.REACT_APP_ID_POLL_MENTA):
      case Number(process.env.REACT_APP_ID_POLL_BIODENS):
      case Number(process.env.REACT_APP_ID_POLL_MENTA_DEL_VALLE):
      case Number(process.env.REACT_APP_ID_POLL_SMILERS):
      case Number(process.env.REACT_APP_ID_POLL_ODONTO_CLINICA):
      case Number(process.env.REACT_APP_ID_POLL_CTMELIPILLA):
      case Number(process.env.REACT_APP_ID_POLL_DENTISTAS_TIJUANA):
      case Number(process.env.REACT_APP_ID_POLL_KEMM):
      case Number(process.env.REACT_APP_ID_POLL_MONTE_VITAL):
      case Number(process.env.REACT_APP_ID_POLL_PROCLINIC):
      case Number(process.env.REACT_APP_ID_POLL_SMILE_AND_MORE):
      case Number(process.env.REACT_APP_ID_POLL_ODONTOSUR):
      case Number(process.env.REACT_APP_ID_POLL_BIOREUMA):
      case Number(process.env.REACT_APP_ID_POLL_ARAPROTEC):
      case Number(process.env.REACT_APP_ID_POLL_ODONTOLOGIA_POR_ESPECIALISTAS):
      case Number(process.env.REACT_APP_ID_POLL_SAN_BARTOLOME):
      case Number(process.env.REACT_APP_ID_POLL_FNH):
      case Number(process.env.REACT_APP_ID_POLL_DENTAL_TOTAL):
      case Number(process.env.REACT_APP_ID_POLL_PEHUEN):
      case Number(process.env.REACT_APP_ID_POLL_FAMILY_DENTAL_CARE):
      case Number(process.env.REACT_APP_ID_POLL_SMILE_KIDS_CENTER):
      case Number(process.env.REACT_APP_ID_POLL_AVARIA):
      case Number(process.env.REACT_APP_ID_POLL_ORREGO_LUCO):
      case Number(process.env.REACT_APP_ID_POLL_CSI):
      case Number(process.env.REACT_APP_ID_POLL_DENTAL_REAGAN):
      case Number(process.env.REACT_APP_ID_POLL_YOHANAN_THERAPEUTES):
      case Number(process.env.REACT_APP_ID_POLL_180_GRADOS):
      case Number(process.env.REACT_APP_ID_POLL_TU_SALUD_DENTAL):
        return juntarConfirmaYReagenda(0, 104)
      
      case Number(process.env.REACT_APP_ID_POLL_DENTALSTUDIO):
        return juntarConfirmaYReagendaAutomatico(0, 104, 204)

      case Number(process.env.REACT_APP_ID_POLL_EVEREST1):
      case Number(process.env.REACT_APP_ID_POLL_EVEREST2):
        return juntarConfirmaYReagendaAutomatico(50, 104, 204)
      
      case Number(process.env.REACT_APP_ID_POLL_SANASALUD_KOPLAND_T5):
        return [
          {
            texto: '¿Confirma?',
            tipo: 'YESNO',
            f: r => r[0]
          },
          {
            texto: 'Reagenda',
            tipo: 'YESNO',
            f: r => r[1]
          },
          {
            texto: '¿Por qué no?',
            tipo: 'OPEN',
            f: r => r[-15]
          },
          {
            texto: '¿Por qué no?',
            tipo: 'OPEN',
            f: r => r[-16]
          },
        ]
      
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
