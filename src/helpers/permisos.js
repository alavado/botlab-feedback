export const tieneAccesoAReportes = (cuenta) => {
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
    'centauro',
    'centraldental_cero',
  ].includes(cuenta)
}

export const tieneAccesoAAlertas = (cuenta) => {
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

export const tieneAccesoAUNREACHABLES = (cuenta) => {
  const cuentasSinAcceso = [
    // Redsalud
    'sanasalud',
    'sanasalud_cero',
    'norden',
    'norden_cero',
    'mega_admin_cero',
  ]
  return !cuentasSinAcceso.includes(cuenta.toLowerCase())
}

export const tieneAccesoADashboard = (cuenta) => {
  const cuentasConAcceso = [
    // Redsalud
    'nucleosalud',
    'alemana',
    'hospital_osorno',
    'hospital_puerto_montt',
  ]
  return (
    cuentasConAcceso.includes(cuenta.toLowerCase()) || cuenta.endsWith('_cero')
  )
}

export const esRedSalud = (cuenta) => {
  return cuenta.indexOf('redsalud') >= 0
}

export const showAlertDismissedBy = (cuenta) => {
  return cuenta.toLowerCase().indexOf('farr') >= 0
}
