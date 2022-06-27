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

    // Centauro
    'centauro_zona_c',
    'centauro_zona_b',
    'centauro_zona_a',
    'centauro_sistemas',
    'centauro_cat',
    'centauro_c_san_angel',
    'centauro_c_queretaro',
    'centauro_c_puerta_la_victoria',
    'centauro_c_parques_polanco',
    'centauro_c_monterrey_cuauhtemoc',
    'centauro_c_monterrey',
    'centauro_c_gran_sur',
    'centauro_b_zapopan',
    'centauro_b_sentura',
    'centauro_b_puebla',
    'centauro_b_plaza_mexico',
    'centauro_b_hermosillo',
    'centauro_b_galerias',
    'centauro_b_churubusco',
    'centauro_a_toluca',
    'centauro_a_tijuana',
    'centauro_a_tecnoparque',
    'centauro_a_santa_fe',
    'centauro_a_lindavista',
    'centauro_a_interlomas',
    'centauro_a_del_valle',
    'centauro',

    // Bukal
    'bukal',

    //Tabilo, consulta del doctor
    'tabilo',

    // 2020, Clínica Oftalmológica
    '2020',

    // Visum, Centro Oftalmológico
    'visum',

    // CORE, Centro Médico
    'core',

    // Laboratorio Cánovas
    'canovas',

    // Le Ciel- Confirmaciones, Clínica
    'leciel',

    // Cath, Clínica 
    'cath',

    // Integral Linares, Clínica 
    'integral_linares',

    // ADICH
    'adich',

    // Dental Reagan 
    'dentalreagan',

    // Dental Total Clinic
    'dentaltotal',

    // Smile Kids Center
    'smilekidscenter',

    // Orrego Luco, Clínica 
    'orregoluco',

    // Smilers
    'smilers',

    // San Bartolome
    'sanbartolome',

    // COP
    'cop',

    // BeHappy, Centro Dental 
    'behappy',

    // CTMelipilla
    'ctmelipilla',

    // Menta Lindavista
    'menta',

    // CRD, Clínica
    'crd',

    // Bracket Center
    'bracketcenter',

    // Smile Design Clinic
    'smiledesign',

    // COEPEJ
    'coepej',

    // Marchesani, Clínica 
    'marchesani',

    // Clinica Alemana - Dental
    'alemana',
    'vguerra@alemana.cl',
    'krodriguez@alemana.cl',

    // OAS, Odontología Avanzada Sonríe
    'oas',

    // Cerro Grande, Clínica 
    'cerrogrande',

    // Beladent
    'beladent',

    // Vitalia, Clínica 
    'vitalia',

    // AltoTobalaba, Centro Médico
    'altotobalaba',

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

    // Medisis
    'medisis',

    // Tobalaba, Clínica Dental
    'tobalaba',

    // RoaDent, Clínica Odontológica
    'roadent',

    // Face Lab
    'facelab',

    // Sonríe Arica, Clínica
    'sonrie_arica',

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