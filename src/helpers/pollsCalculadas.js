const obtenerIconoAreaRedsalud = area => {
  switch (area) {
    case 'Dental':
      return 'mdi:tooth'
    case 'Médica':
      return 'mdi:medical-bag'
    case 'Telemedicina':
      return 'mdi:clipboard-pulse'
    case 'GES':
      return 'mdi:hospital'
    default:
      return 'mdi:medical-bag'
  }
}

const crearPollPorFiltro = (encuesta, respuestas, header) => {
  const encuestasFicticias = [...new Set(respuestas.map(r => r[header]))]
    .map(s => {
      const nombreEncuesta = `${encuesta.nombre} - ${s}`
      return {
        id: `filtro|${header}|${s}|${encuesta.id}|${nombreEncuesta}`,
        nombre: nombreEncuesta,
        propiedad: s,
        enabled: encuesta.enabled,
        icono: encuesta.id === 220 ? obtenerIconoAreaRedsalud(s) : 'mdi:map-marker-radius'
      }})
    .sort((s1, s2) => s1.nombre < s2.nombre ? -1 : 1)
  return encuestasFicticias.length > 0 ? encuestasFicticias : []
}

export const obtenerPollsCalculadas = (encuesta, respuestas) => {
  if (!respuestas) {
    return []
  }
  switch (encuesta.id) {
    case Number(process.env.REACT_APP_ID_POLL_SANTA_BLANCA_RECONFIRMACION):
    case Number(process.env.REACT_APP_ID_POLL_SANTA_BLANCA_CONFIRMACION):
    case Number(process.env.REACT_APP_ID_POLL_DENTALSTUDIO):
    case Number(process.env.REACT_APP_ID_POLL_CDC):
    case Number(process.env.REACT_APP_ID_POLL_EVEREST1):
    case Number(process.env.REACT_APP_ID_POLL_EVEREST2):
    case Number(process.env.REACT_APP_ID_POLL_DENTAL_MAS):
    case Number(process.env.REACT_APP_ID_POLL_DENTAL_MAS_MXL):
    case Number(process.env.REACT_APP_ID_POLL_DENTAL_MAS_JWARNER):
    case Number(process.env.REACT_APP_ID_POLL_OAS):
    case Number(process.env.REACT_APP_ID_POLL_OAS_RECONFIRMACION):
    case Number(process.env.REACT_APP_ID_POLL_EDERNA):
    case Number(process.env.REACT_APP_ID_POLL_DENT_ALL_CLEAR):
    case Number(process.env.REACT_APP_ID_POLL_SMILE_DESIGN):
    case Number(process.env.REACT_APP_ID_POLL_ODONTOLOGIA_POR_ESPECIALISTAS):
    case Number(process.env.REACT_APP_ID_POLL_SMILE_KIDS_CENTER):
      return crearPollPorFiltro(encuesta, respuestas, 'sucursal_name')
    case 220:
      return crearPollPorFiltro(encuesta, respuestas, 'area_1')
    default: return []
  }
}