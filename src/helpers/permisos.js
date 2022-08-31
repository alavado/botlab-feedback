export const tieneAccesoAReportes = cuenta => {
  if (!cuenta.startsWith('centauro') && !cuenta.startsWith('centraldental')) {
    return true
  }
  return [
    'centauro_cero',
    'centauro_zona_a',
    'centauro_zona_b',
    'centauro_zona_c',
    'centauro_cat',
    'centauro_sistemas',
    'centraldental',
    'centraldental_cero',
  ].includes(cuenta)
}

export const tieneAccesoAAlertas = cuenta => {
  const cuentasSinAlertas = [
  
    // Redsalud
    'redsalud',
    'redsalud_botlab',
    'redsalud_derivaciones',
    'redsalud_derivaciones_botlab',
    'redsalud_derivaciones_view',
    'redsalud_cm',
    'redsalud_cm_botlab',
    'redsalud_wl',
    'redsalud_wl_botlab',
    'redsalud_ba',
    'redsalud_ba_botlab',
  ]
  return !cuentasSinAlertas.includes(cuenta.toLowerCase())
}