export const obtenerTiposEncuestasVisibles = (cuenta, tipos) => {
  if (cuenta === 'mega_admin_cero') {
    return tipos
  }
  let tiposEncuestas = tipos?.slice() || []
  const cuentaLC = cuenta?.toLowerCase() || ''
  if (cuentaLC !== 'sanasalud_botlab') {
    tiposEncuestas = tiposEncuestas.filter(t => t.id !== 233)
  }
  if (cuentaLC !== 'falp_cero') {
    tiposEncuestas = tiposEncuestas.filter(t => t.id !== 374)
  }
  if (cuentaLC !== 'alemana_cero') {
    tiposEncuestas = tiposEncuestas.filter(t => t.id !== 457)
  }
  if (cuentaLC !== 'everest_cero') {
    tiposEncuestas = tiposEncuestas.filter(t => t.id !== 577)
  }
  return tiposEncuestas
}
