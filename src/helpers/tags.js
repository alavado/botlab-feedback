export const YES = 'YES'
export const NO = 'NO'
export const REAGENDA = 'REAGENDA'
export const REAGENDADO = 'REAGENDADO'
export const OUT = 'OUT'
export const DEFAULT = 'DEFAULT'
export const INFO_REAGENDA = 'INFO_REAGENDA'
export const NO_INFO_REAGENDA = 'NO_INFO_REAGENDA'
export const NINGUNA = 'NINGUNA'
export const CUALQUIERA = 'CUALQUIERA'
export const AGENDA_OPCION_1 = 'AGENDA_OPCION_1'
export const AGENDA_OPCION_2 = 'AGENDA_OPCION_2'
export const AGENDA_OPCION_3 = 'AGENDA_OPCION_3'
export const AGENDA_OPCION_4 = 'AGENDA_OPCION_4'
export const AGENDA_OPCION_5 = 'AGENDA_OPCION_5'

const tags = {
  YES: {
    texto: 'Sí',
    titulo: 'Confirmaciones',
    icono: 'mdi:check',
    clase: 'TagRespuesta TagRespuesta--si',
    color: 'var(--color-si)',
  },
  NO: {
    texto: 'No',
    titulo: 'Cancelaciones',
    icono: 'mdi:close',
    clase: 'TagRespuesta TagRespuesta--no',
    color: 'var(--color-no)',
  },
  'PHONE:YES': {
    texto: 'Sí',
    titulo: 'Confirmaciones',
    icono: 'mdi:check',
    clase: 'TagRespuesta TagRespuesta--si',
    color: 'var(--color-si)',
  },
  'PHONE:NO': {
    texto: 'No',
    titulo: 'Cancelaciones',
    icono: 'mdi:close',
    clase: 'TagRespuesta TagRespuesta--no',
    color: 'var(--color-no)',
  },
  'PHONE:OUT': {
    texto: 'Out',
    titulo: 'Out',
    icono: 'mdi:question-mark',
    clase: 'TagRespuesta TagRespuesta--out',
    color: 'var(--color-out)',
  },
  FALLECIO_OTRO: {
    texto: 'No',
    titulo: 'Cancelaciones',
    icono: 'mdi:close',
    clase: 'TagRespuesta TagRespuesta--no',
    color: 'var(--color-no)',
  },
  REAGENDA: {
    texto: 'Reagenda',
    titulo: 'Reagendamientos',
    icono: 'mdi:arrow-right',
    clase: 'TagRespuesta TagRespuesta--reagenda',
    color: 'var(--color-reagenda)',
  },
  OUT: {
    texto: 'Out',
    titulo: 'Out',
    icono: 'mdi:question-mark',
    clase: 'TagRespuesta TagRespuesta--out',
    color: 'var(--color-out)',
  },
  SMALL_TALK: {
    texto: 'Out',
    titulo: 'Out',
    icono: 'mdi:question-mark',
    clase: 'TagRespuesta TagRespuesta--out',
    color: 'var(--color-out)',
  },
  REAGENDADO: {
    texto: 'Reagendado',
    titulo: 'Reagendamientos ok',
    icono: 'mdi:check',
    clase: 'TagRespuesta TagRespuesta--reagendado',
    color: 'var(--color-reagendado)',
  },
  'S/R': {
    texto: 'Sin respuesta',
    titulo: 'Sin respuesta',
    icono: 'mdi:timer-sand',
    clase: 'TagRespuesta TagRespuesta--vacia',
    color: 'white',
  },
  DEFAULT: {
    texto: 'Sí',
    titulo: 'Respuestas',
    icono: 'mdi:check',
    clase: 'TagRespuesta TagRespuesta--si',
    color: 'white',
  },
  INFO_REAGENDA: {
    texto: 'Paciente indica fechas',
    titulo: 'Paciente indica fechas',
    icono: 'mdi:check',
    clase: 'TagRespuesta TagRespuesta--si',
    color: '',
  },
  NO_INFO_REAGENDA: {
    texto: 'Paciente no indica fechas',
    titulo: 'Paciente no indica fechas',
    icono: 'mdi:close',
    clase: 'TagRespuesta TagRespuesta--no',
    color: '',
  },
  NO_REAGENDA: {
    texto: 'No',
    titulo: 'Paciente no reagenda',
    icono: 'mdi:close',
    clase: 'TagRespuesta TagRespuesta--no',
    color: '',
  },
  NINGUNA: {
    texto: 'Ninguna',
    titulo: 'Ninguna',
    icono: 'mdi:close',
    clase: 'TagRespuesta TagRespuesta--no',
    color: '',
  },
  CUALQUIERA: {
    texto: 'Cualquiera',
    titulo: 'Cualquiera',
    icono: 'mdi:check',
    clase: 'TagRespuesta TagRespuesta--si',
    color: '',
  },
  '': {
    texto: 'Vacío',
    titulo: '',
    icono: 'mdi:timer-sand',
    clase: 'TagRespuesta TagRespuesta--vacia',
    color: 'var(--color-bordes)',
  },
  1: {
    texto: '1',
    titulo: '1',
    icono: 'mdi:check',
    clase: 'TagRespuesta TagRespuesta--si',
    color: '',
  },
  2: {
    texto: '2',
    titulo: '2',
    icono: 'mdi:check',
    clase: 'TagRespuesta TagRespuesta--si',
    color: '',
  },
  3: {
    texto: '3',
    titulo: '3',
    icono: 'mdi:check',
    clase: 'TagRespuesta TagRespuesta--si',
    color: '',
  },
  4: {
    texto: '4',
    titulo: '4',
    icono: 'mdi:check',
    clase: 'TagRespuesta TagRespuesta--si',
    color: '',
  },
  5: {
    texto: '5',
    titulo: '5',
    icono: 'mdi:check',
    clase: 'TagRespuesta TagRespuesta--si',
    color: '',
  },
  6: {
    texto: '6',
    titulo: '6',
    icono: 'mdi:check',
    clase: 'TagRespuesta TagRespuesta--si',
    color: '',
  },
  PC_PRECIO: {
    texto: 'Consulta precio',
    titulo: 'Paciente consulta por precio',
<<<<<<< HEAD
    icono: question,
=======
    icono: 'mdi:question-mark',
>>>>>>> cero2/main
    clase: 'TagRespuesta TagRespuesta--vacia',
    color: 'var(--color-bordes)',
  },
  PC_SEGURO: {
    texto: 'Consulta seguro',
    titulo: 'Paciente consulta por seguro de salud',
<<<<<<< HEAD
    icono: question,
=======
    icono: 'mdi:question-mark',
>>>>>>> cero2/main
    clase: 'TagRespuesta TagRespuesta--vacia',
    color: 'var(--color-bordes)',
  },
  PC_DIRECCION: {
    texto: 'Consulta dirección',
    titulo: 'Paciente consulta por dirección',
<<<<<<< HEAD
    icono: question,
    clase: 'TagRespuesta TagRespuesta--vacia',
    color: 'var(--color-bordes)'
=======
    icono: 'mdi:question-mark',
    clase: 'TagRespuesta TagRespuesta--vacia',
    color: 'var(--color-bordes)',
>>>>>>> cero2/main
  },
  QUIERE_HABLAR: {
    texto: 'Quiere llamar',
    titulo: 'Quiere llamar',
<<<<<<< HEAD
    icono: question,
    clase: 'TagRespuesta TagRespuesta--vacia',
    color: 'var(--color-bordes)'
  },
  MEDIA_IMAGE: {
    texto: 'Imagen',
    titulo: 'Paciente envía imagen',
    icono: file,
=======
    icono: 'mdi:question-mark',
>>>>>>> cero2/main
    clase: 'TagRespuesta TagRespuesta--vacia',
    color: 'var(--color-bordes)',
  },
  MEDIA_IMAGE: {
    texto: 'Imagen',
    titulo: 'Paciente envía imagen',
    icono: 'mdi:file',
    clase: 'TagRespuesta TagRespuesta--vacia',
    color: 'var(--color-bordes)',
  },
  MEDIA_AUDIO: {
    texto: 'Audio',
    titulo: 'Paciente envía audio',
    icono: 'mdi:volume-high',
    clase: 'TagRespuesta TagRespuesta--vacia',
    color: 'var(--color-bordes)',
  },
  MEDIA_VCARD: {
    texto: 'Contacto',
    titulo: 'Paciente envía contacto',
    icono: 'mdi:card-account-phone',
    clase: 'TagRespuesta TagRespuesta--vacia',
    color: 'var(--color-bordes)',
  },
  CONFIRMA_DESPUES: {
    texto: 'Confirma después',
    titulo: 'Paciente indica que confirmará más tarde',
    icono: 'mdi:check',
    clase: 'TagRespuesta TagRespuesta--vacia',
    color: 'var(--color-bordes)',
  },
  RESPUESTA_AUTO: {
    texto: 'Respuesta automática',
    titulo: 'Responde un robot',
    icono: 'mdi:robot',
    clase: 'TagRespuesta TagRespuesta--vacia',
    color: 'var(--color-bordes)',
  },
  REVERTIR: {
    texto: 'REVERTIR',
    titulo: 'REVERTIR',
    icono: 'mdi:check',
    clase: 'TagRespuesta TagRespuesta--vacia',
<<<<<<< HEAD
    color: 'var(--color-bordes)'
=======
    color: 'var(--color-bordes)',
>>>>>>> cero2/main
  },
  DATETIME: {
    texto: 'Fecha',
    titulo: 'Fecha',
<<<<<<< HEAD
    icono: check,
    clase: 'TagRespuesta TagRespuesta--si',
    color: ''
=======
    icono: 'mdi:check',
    clase: 'TagRespuesta TagRespuesta--si',
    color: '',
>>>>>>> cero2/main
  },
  COMUNA: {
    texto: 'Comuna',
    titulo: 'Comuna',
<<<<<<< HEAD
    icono: check,
    clase: 'TagRespuesta TagRespuesta--si',
    color: ''
=======
    icono: 'mdi:check',
    clase: 'TagRespuesta TagRespuesta--si',
    color: '',
  },
  AGENDAR: {
    texto: 'Agendar hora',
    titulo: 'Agendar hora',
    icono: 'mdi:check',
    clase: 'TagRespuesta TagRespuesta--vacia',
    color: '',
  },
  AGENDAR_OTRO: {
    texto: 'Agendar (otro)',
    titulo: 'Agendar (otro)',
    icono: 'mdi:check',
    clase: 'TagRespuesta TagRespuesta--vacia',
    color: '',
  },
  AGENDAR_EV_DENTAL: {
    texto: 'Agendar evaluación dental',
    titulo: 'Agendar evaluación dental',
    icono: 'mdi:check',
    clase: 'TagRespuesta TagRespuesta--vacia',
    color: '',
  },
  YA_ASISTIO: {
    texto: 'Ya asistió',
    titulo: 'Paciente indica que ya asistió a su cita',
    icono: 'mdi:check',
    clase: 'TagRespuesta TagRespuesta--vacia',
    color: '',
  },
  YA_REAGENDO: {
    texto: 'Ya reagendó',
    titulo: 'Paciente indica que ya reagendó su cita',
    icono: 'mdi:check',
    clase: 'TagRespuesta TagRespuesta--vacia',
    color: '',
  },
  YA_CANCELO: {
    texto: 'No',
    titulo: 'Paciente indica que ya cenceló su cita',
    icono: 'mdi:check',
    clase: 'TagRespuesta TagRespuesta--no',
    color: '',
  },
  YA_CONFIRMO: {
    texto: 'Sí',
    titulo: 'Paciente indica que ya confirmó su cita',
    icono: 'mdi:check',
    clase: 'TagRespuesta TagRespuesta--si',
    color: '',
  },
  CONTRADICCION: {
    texto: 'Contradicción',
    titulo: 'Paciente indica que hay información contradictoria',
    icono: 'mdi:close',
    clase: 'TagRespuesta TagRespuesta--vacia',
    color: '',
  },
  IN_CONTRADICCION: {
    texto: 'Contradicción (i)',
    titulo: 'Paciente indica que hay información contradictoria',
    icono: 'mdi:close',
    clase: 'TagRespuesta TagRespuesta--vacia',
    color: '',
  },
  REAGENDA_SOFT: {
    texto: 'Reagenda sin perder hora',
    titulo: 'Paciente intenta reagendar solo de ser posible',
    icono: 'mdi:arrow-right',
    clase: 'TagRespuesta TagRespuesta--vacia',
    color: '',
>>>>>>> cero2/main
  },
  'COMUNA-DATETIME': {
    texto: 'Fecha y comuna',
    titulo: 'Fecha y comuna',
<<<<<<< HEAD
    icono: check,
    clase: 'TagRespuesta TagRespuesta--si',
    color: ''
=======
    icono: 'mdi:check',
    clase: 'TagRespuesta TagRespuesta--si',
    color: '',
>>>>>>> cero2/main
  },
  'action_result:SUCCESS': {
    texto: 'Éxito',
    titulo: 'Éxito',
<<<<<<< HEAD
    icono: check,
    clase: 'TagRespuesta TagRespuesta--si',
    color: ''
=======
    icono: 'mdi:check',
    clase: 'TagRespuesta TagRespuesta--si',
    color: '',
>>>>>>> cero2/main
  },
  'action_result:FAILURE': {
    texto: 'Error',
    titulo: 'Error',
<<<<<<< HEAD
    icono: cancel,
    clase: 'TagRespuesta TagRespuesta--no',
    color: ''
=======
    icono: 'mdi:close',
    clase: 'TagRespuesta TagRespuesta--no',
    color: '',
>>>>>>> cero2/main
  },
  'action_result:NO_OPTION': {
    texto: 'No se encuentra',
    titulo: 'No se encuentra',
<<<<<<< HEAD
    icono: cancel,
    clase: 'TagRespuesta TagRespuesta--no',
    color: ''
  }
=======
    icono: 'mdi:close',
    clase: 'TagRespuesta TagRespuesta--no',
    color: '',
  },
  AGENDA_OPCION_1: {
    texto: 'Bloque 1 agendado',
    titulo: 'Bloque 1 agendado',
    icono: 'mdi:check',
    clase: 'TagRespuesta TagRespuesta--si',
    color: '',
  },
  AGENDA_OPCION_2: {
    texto: 'Bloque 2 agendado',
    titulo: 'Bloque 2 agendado',
    icono: 'mdi:check',
    clase: 'TagRespuesta TagRespuesta--si',
    color: '',
  },
  AGENDA_OPCION_3: {
    texto: 'Bloque 3 agendado',
    titulo: 'Bloque 3 agendado',
    icono: 'mdi:check',
    clase: 'TagRespuesta TagRespuesta--si',
    color: '',
  },
  AGENDA_OPCION_4: {
    texto: 'Bloque 4 agendado',
    titulo: 'Bloque 4 agendado',
    icono: 'mdi:check',
    clase: 'TagRespuesta TagRespuesta--si',
    color: '',
  },
  AGENDA_OPCION_5: {
    texto: 'Bloque 5 agendado',
    titulo: 'Bloque 5 agendado',
    icono: 'mdi:check',
    clase: 'TagRespuesta TagRespuesta--si',
    color: '',
  },
  MANTENER_ORIGINAL: {
    texto: 'Mantener original',
    titulo: 'Mantener original',
    icono: 'mdi:check',
    clase: 'TagRespuesta TagRespuesta--si',
    color: '',
  },
  UNREACHABLE: {
    texto: 'No tiene Whatsapp',
    titulo: 'No tiene Whatsapp',
    icono: 'mdi:alert',
    clase: 'TagRespuesta TagRespuesta--is_unreachable',
    color: '',
  },
  EQUIVOCADO: {
    texto: 'Equivocado',
    titulo: 'Equivocado',
    icono: 'mdi:alert',
    clase: 'TagRespuesta  TagRespuesta--vacia',
    color: '',
  },
  EQUIVOCADO_MAS_INFO: {
    texto: 'Equivocado (i)',
    titulo: 'Equivocado',
    icono: 'mdi:alert',
    clase: 'TagRespuesta  TagRespuesta--vacia',
    color: '',
  },
  FALLECIO: {
    texto: 'Falleció',
    titulo: 'Falleció',
    icono: 'mdi:alert',
    clase: 'TagRespuesta  TagRespuesta--vacia',
    color: '',
  },
>>>>>>> cero2/main
}

const diccionarioTags = (tag) => {
  let tagEnDiccionario = tags[tag]
  if (tagEnDiccionario) {
    tagEnDiccionario = {
      ...tagEnDiccionario,
      id: 'TAG' + tagEnDiccionario.texto + 'TAG',
    }
  }
  return (
    tagEnDiccionario || {
      id: '',
      texto: tag,
      titulo: tag,
      icono: 'mdi:check',
      clase: 'TagRespuesta TagRespuesta--vacia',
      color: 'var(--color-bordes)',
    }
  )
}

export default diccionarioTags
