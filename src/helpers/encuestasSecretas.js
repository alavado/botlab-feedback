export const obtenerTiposEncuestasVisibles = (cuenta, tipos) => {
  const cuentaLC = cuenta?.toLowerCase() || ''
  if (cuentaLC.endsWith('_cero') || cuentaLC.endsWith('_botlab')) {
    return tipos
  }
  let tiposEncuestas = tipos?.slice() || []
  return tiposEncuestas.filter(t => ![233, 374, 457].includes(t.id))
}
