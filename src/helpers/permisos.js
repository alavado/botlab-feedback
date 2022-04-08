export const tieneAccesoAReportes = cuenta => {
  if (!cuenta.startsWith('centauro')) {
    return true
  }
  return [
    'centauro_cero',
    'centauro_zona_a',
    'centauro_zona_b',
    'centauro_zona_c',
    'centauro_cat',
    'centauro_sistemas'
  ].includes(cuenta)
}