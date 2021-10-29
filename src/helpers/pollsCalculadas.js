import iconoSucursal from '@iconify/icons-mdi/map-marker-radius'

const crearPollPorFiltro = (encuesta, respuestas, header) => {
  const encuestasFicticias = [...new Set(respuestas.map(r => r[header]))]
    .map(s => {
      const nombreEncuesta = `${encuesta.nombre} - ${s}`
      return {
        id: `filtro|${header}|${s}|${encuesta.id}|${nombreEncuesta}`,
        nombre: nombreEncuesta,
        enabled: encuesta.enabled,
        icono: iconoSucursal
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
      return crearPollPorFiltro(encuesta, respuestas, 'sucursal_name')
    default: return []
  }
}