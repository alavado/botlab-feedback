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

const tags = {
  YES: {
    texto: 'Sí',
    titulo: 'Confirmaciones',
    icono: "mdi:check",
    clase: 'TagRespuesta TagRespuesta--si',
    color: 'var(--color-si)'
  },
  NO: {
    texto: 'No',
    titulo: 'Cancelaciones',
    icono: 'mdi:close',
    clase: 'TagRespuesta TagRespuesta--no',
    color: 'var(--color-no)'
  },
  REAGENDA: {
    texto: 'Reagenda',
    titulo: 'Reagendamientos',
    icono: 'mdi:arrow-right',
    clase: 'TagRespuesta TagRespuesta--reagenda',
    color: 'var(--color-reagenda)'
  },
  OUT: {
    texto: 'Out',
    titulo: 'Out',
    icono: 'mdi:question-mark',
    clase: 'TagRespuesta TagRespuesta--out',
    color: 'var(--color-out)'
  },
  REAGENDADO: {
    texto: 'Reagendado',
    titulo: 'Reagendamientos ok',
    icono: 'mdi:check',
    clase: 'TagRespuesta TagRespuesta--reagendado',
    color: 'var(--color-reagendado)'
  },
  'S/R': {
    texto: 'Sin respuesta',
    titulo: 'Sin respuesta',
    icono: 'mdi:timer-sand',
    clase: 'TagRespuesta TagRespuesta--vacia',
    color: 'white'
  },
  DEFAULT: {
    texto: 'Sí',
    titulo: 'Respuestas',
    icono: 'mdi:check',
    clase: 'TagRespuesta TagRespuesta--si',
    color: 'white'
  },
  INFO_REAGENDA: {
    texto: 'Paciente indica fechas',
    titulo: 'Paciente indica fechas',
    icono: 'mdi:check',
    clase: 'TagRespuesta TagRespuesta--si',
    color: ''
  },
  NO_INFO_REAGENDA: {
    texto: 'Paciente no indica fechas',
    titulo: 'Paciente no indica fechas',
    icono: 'mdi:close',
    clase: 'TagRespuesta TagRespuesta--no',
    color: ''
  },
  NO_REAGENDA: {
    texto: 'No',
    titulo: 'Paciente no reagenda',
    icono: 'mdi:close',
    clase: 'TagRespuesta TagRespuesta--no',
    color: ''
  },
  NINGUNA: {
    texto: 'Ninguna',
    titulo: 'Ninguna',
    icono: 'mdi:close',
    clase: 'TagRespuesta TagRespuesta--no',
    color: ''
  },
  CUALQUIERA: {
    texto: 'Cualquiera',
    titulo: 'Cualquiera',
    icono: 'mdi:check',
    clase: 'TagRespuesta TagRespuesta--si',
    color: ''
  },
  '': {
    texto: 'Vacío',
    titulo: '',
    icono: 'mdi:timer-sand',
    clase: 'TagRespuesta TagRespuesta--vacia',
    color: 'var(--color-bordes)'
  },
  '1': {
    texto: '1',
    titulo: '1',
    icono: 'mdi:check',
    clase: 'TagRespuesta TagRespuesta--si',
    color: ''
  },
  '2': {
    texto: '2',
    titulo: '2',
    icono: 'mdi:check',
    clase: 'TagRespuesta TagRespuesta--si',
    color: ''
  },
  '3': {
    texto: '3',
    titulo: '3',
    icono: 'mdi:check',
    clase: 'TagRespuesta TagRespuesta--si',
    color: ''
  },
  '4': {
    texto: '4',
    titulo: '4',
    icono: 'mdi:check',
    clase: 'TagRespuesta TagRespuesta--si',
    color: ''
  },
  '5': {
    texto: '5',
    titulo: '5',
    icono: 'mdi:check',
    clase: 'TagRespuesta TagRespuesta--si',
    color: ''
  },
  PC_PRECIO: {
    texto: 'Consulta precio',
    titulo: 'Paciente consulta por precio',
    icono: 'mdi:question-mark',
    clase: 'TagRespuesta TagRespuesta--vacia',
    color: 'var(--color-bordes)'
  },
  PC_SEGURO: {
    texto: 'Consulta seguro',
    titulo: 'Paciente consulta por seguro de salud',
    icono: 'mdi:question-mark',
    clase: 'TagRespuesta TagRespuesta--vacia',
    color: 'var(--color-bordes)'
  },
  PC_DIRECCION: {
    texto: 'Consulta dirección',
    titulo: 'Paciente consulta por dirección',
    icono: 'mdi:question-mark',
    clase: 'TagRespuesta TagRespuesta--vacia',
    color: 'var(--color-bordes)'
  },
  QUIERE_HABLAR: {
    texto: 'Quiere llamar',
    titulo: 'Quiere llamar',
    icono: 'mdi:question-mark',
    clase: 'TagRespuesta TagRespuesta--vacia',
    color: 'var(--color-bordes)'
  },
  MEDIA_IMAGE: {
    texto: 'Imagen',
    titulo: 'Paciente envía imagen',
    icono: 'mdi:file',
    clase: 'TagRespuesta TagRespuesta--vacia',
    color: 'var(--color-bordes)'
  },
  CONFIRMA_DESPUES: {
    texto: 'Confirma después',
    titulo: 'Paciente indica que confirmará más tarde',
    icono: 'mdi:check',
    clase: 'TagRespuesta TagRespuesta--vacia',
    color: 'var(--color-bordes)'
  },
  RESPUESTA_AUTO: {
    texto: 'RESPUESTA_AUTO',
    titulo: 'RESPUESTA_AUTO',
    icono: 'mdi:check',
    clase: 'TagRespuesta TagRespuesta--vacia',
    color: 'var(--color-bordes)'
  },
  REVERTIR: {
    texto: 'REVERTIR',
    titulo: 'REVERTIR',
    icono: 'mdi:check',
    clase: 'TagRespuesta TagRespuesta--vacia',
    color: 'var(--color-bordes)'
  },
  DATETIME: {
    texto: 'Fecha',
    titulo: 'Fecha',
    icono: 'mdi:check',
    clase: 'TagRespuesta TagRespuesta--si',
    color: ''
  },
  COMUNA: {
    texto: 'Comuna',
    titulo: 'Comuna',
    icono: 'mdi:check',
    clase: 'TagRespuesta TagRespuesta--si',
    color: ''
  },
  AGENDAR: {
    texto: 'Agendar hora',
    titulo: 'Agendar hora',
    icono: 'mdi:check',
    clase: 'TagRespuesta TagRespuesta--vacia',
    color: ''
  },
  AGENDAR_OTRO: {
    texto: 'Agendar (otro)',
    titulo: 'Agendar (otro)',
    icono: 'mdi:check',
    clase: 'TagRespuesta TagRespuesta--vacia',
    color: ''
  },
  AGENDAR_EV_DENTAL: {
    texto: 'Agendar evaluación dental',
    titulo: 'Agendar evaluación deental',
    icono: 'mdi:check',
    clase: 'TagRespuesta TagRespuesta--vacia',
    color: ''
  },
  'COMUNA-DATETIME': {
    texto: 'Fecha y comuna',
    titulo: 'Fecha y comuna',
    icono: 'mdi:check',
    clase: 'TagRespuesta TagRespuesta--si',
    color: ''
  },
  'action_result:SUCCESS': {
    texto: 'Éxito',
    titulo: 'Éxito',
    icono: 'mdi:check',
    clase: 'TagRespuesta TagRespuesta--si',
    color: ''
  },
  'action_result:FAILURE': {
    texto: 'Error',
    titulo: 'Error',
    icono: 'mdi:close',
    clase: 'TagRespuesta TagRespuesta--no',
    color: ''
  },
  'action_result:NO_OPTION': {
    texto: 'No se encuentra',
    titulo: 'No se encuentra',
    icono: 'mdi:close',
    clase: 'TagRespuesta TagRespuesta--no',
    color: ''
  },
  AGENDA_OPCION_1: {
    texto: 'Bloque 1 agendado',
    titulo: 'Bloque 1 agendado',
    icono: 'mdi:check',
    clase: 'TagRespuesta TagRespuesta--si',
    color: ''
  },
  AGENDA_OPCION_2: {
    texto: 'Bloque 2 agendado',
    titulo: 'Bloque 2 agendado',
    icono: 'mdi:check',
    clase: 'TagRespuesta TagRespuesta--si',
    color: ''
  },
  AGENDA_OPCION_3: {
    texto: 'Bloque 3 agendado',
    titulo: 'Bloque 3 agendado',
    icono: 'mdi:check',
    clase: 'TagRespuesta TagRespuesta--si',
    color: ''
  }
}

const diccionarioTags = tag => tags[tag] || ({
  texto: tag,
  titulo: tag,
  icono: 'mdi:check',
  clase: 'TagRespuesta TagRespuesta--vacia',
  color: 'var(--color-bordes)'
})

export default diccionarioTags