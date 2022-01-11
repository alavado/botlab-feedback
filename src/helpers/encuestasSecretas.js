export const obtenerTiposEncuestasVisibles = (cuenta, tipos) => {
  let tiposEncuestas = tipos?.slice() || []
  const cuentaLC = cuenta.toLowerCase()
  if (cuentaLC !== 'sanasalud_botlab') {
    tiposEncuestas = tiposEncuestas.filter(t => t.id !== 233)
  }
  if (cuentaLC !== 'falp_cero') {
    tiposEncuestas = tiposEncuestas.filter(t => t.id !== 374)
  }
  return tiposEncuestas
}
