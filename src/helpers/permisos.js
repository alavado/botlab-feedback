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

    // Laboratorio Cánovas
    'canovas',

    // Dental Reagan 
    'dentalreagan',

    // Dental Total Clinic
    'dentaltotal',

    // Smile Kids Center
    'smilekidscenter',

    // Smilers
    'smilers',

    // COP
    'cop',

    // Menta Lindavista
    'menta',

    // CRD, Clínica
    'crd',

    // Bracket Center
    'bracketcenter',

    // Smile Design Clinic
    'smiledesign',

    // Marchesani, Clínica 
    'marchesani',

    // Clinica Alemana - Dental
    'alemana',
    'vguerra@alemana.cl',
    'krodriguez@alemana.cl',

    // Cerro Grande, Clínica 
    'cerrogrande',

    // Beladent
    'beladent',

    // Vitalia, Clínica 
    'vitalia',

    // Ventus, Odontología 
    'ventus',

    // Santis, Clínica Dental 
    'santis',

    // AyV Dental
    'ayvdental',
    'ayvdental2',

    // RAO Red Avanzada de Ortodoncia
    'rao_admin',
    'rao',

    // Dental Studio
    'dentalstudio',

    // 3Dent - Once16, Clínica
    '3dentonce16',
    '3dent',

    // Alpha Salud Bio Bio
    'alphasaludbiobio',

    // CDC Dental
    'cdcdental',

    // Ezio Chiappe, Clínica Dr.
    'eziochiappe',

    // Tobalaba, Clínica Dental
    'tobalaba',

    // RoaDent, Clínica Odontológica
    'roadent',

    // Dental Spa Chile
    'dentalspachile',

    // O&E Viña del Mar, Clínica
    'oyedentalvina',

    // Altos del Valle, Clínica
    'altosdelvalle',

    // BASU, Clínica
    'basu',

    // Las Cruces, Clínica
    'las_cruces',

    // Ortodoncia Chile
    'ortodoncia_chile',
  
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

    // Vitasalud
    'vitasalud_admin',
    'vitasalud',
    'kvera_vitasalud',

    // Norden
    'norden',

    // Sanasalud
    'sanasalud_admin',
    'sanasalud_callcenter',
    'sanasalud_felipe',
    'roberto.rosas',
    'claudio.jorquera',
    'ignacio.cordero',
    'diego.moreira',
    'sebastian.polanco',
    'alfredo.sepulveda',
    'jorge.molina',
    'marcela.plaza',
    'fabian.rojas',
    'tomas.correa',
    'daniel.verdugo',
    'sanasalud_sebastian',
  ]
  return !cuentasSinAlertas.includes(cuenta.toLowerCase())
}