
import check from '@iconify/icons-mdi/check'
import cancel from '@iconify/icons-mdi/close'
import refresh from '@iconify/icons-mdi/arrow-right'
import option from '@iconify/icons-mdi/check'
import question from '@iconify/icons-mdi/question-mark'
import time from '@iconify/icons-mdi/timer-sand'

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

const tags = {
  YES: {
    texto: 'Sí',
    titulo: 'Confirmaciones',
    icono: check,
    clase: 'TagRespuesta TagRespuesta--si',
    color: 'var(--color-si)'
  },
  NO: {
    texto: 'No',
    titulo: 'Cancelaciones',
    icono: cancel,
    clase: 'TagRespuesta TagRespuesta--no',
    color: 'var(--color-no)'
  },
  REAGENDA: {
    texto: 'Reagenda',
    titulo: 'Reagendamientos',
    icono: refresh,
    clase: 'TagRespuesta TagRespuesta--reagenda',
    color: 'var(--color-reagenda)'
  },
  OUT: {
    texto: 'Out',
    titulo: 'Out',
    icono: question,
    clase: 'TagRespuesta TagRespuesta--out',
    color: 'var(--color-out)'
  },
  REAGENDADO: {
    texto: 'Reagendado',
    titulo: 'Reagendamientos ok',
    icono: check,
    clase: 'TagRespuesta TagRespuesta--reagendado',
    color: 'var(--color-reagendado)'
  },
  'S/R': {
    texto: 'Sin respuesta',
    titulo: 'Sin respuesta',
    icono: time,
    clase: 'TagRespuesta TagRespuesta--vacia',
    color: 'white'
  },
  DEFAULT: {
    texto: 'Sí',
    titulo: 'Respuestas',
    icono: check,
    clase: 'TagRespuesta TagRespuesta--si',
    color: 'white'
  },
  INFO_REAGENDA: {
    texto: 'Paciente indica fechas',
    titulo: 'Paciente indica fechas',
    icono: check,
    clase: 'TagRespuesta TagRespuesta--si',
    color: ''
  },
  NO_INFO_REAGENDA: {
    texto: 'Paciente no indica fechas',
    titulo: 'Paciente no indica fechas',
    icono: cancel,
    clase: 'TagRespuesta TagRespuesta--no',
    color: ''
  },
  NO_REAGENDA: {
    texto: 'No',
    titulo: 'Paciente no reagenda',
    icono: cancel,
    clase: 'TagRespuesta TagRespuesta--no',
    color: ''
  },
  NINGUNA: {
    texto: 'Ninguna',
    titulo: 'Ninguna',
    icono: cancel,
    clase: 'TagRespuesta TagRespuesta--no',
    color: ''
  },
  CUALQUIERA: {
    texto: 'Cualquiera',
    titulo: 'Cualquiera',
    icono: check,
    clase: 'TagRespuesta TagRespuesta--si',
    color: ''
  },
  '': {
    texto: 'Vacío',
    titulo: '',
    icono: time,
    clase: 'TagRespuesta TagRespuesta--vacia',
    color: 'var(--color-bordes)'
  },
  '1': {
    texto: '1',
    titulo: '1',
    icono: option,
    clase: 'TagRespuesta TagRespuesta--si',
    color: ''
  },
  '2': {
    texto: '2',
    titulo: '2',
    icono: option,
    clase: 'TagRespuesta TagRespuesta--si',
    color: ''
  },
  '3': {
    texto: '3',
    titulo: '3',
    icono: option,
    clase: 'TagRespuesta TagRespuesta--si',
    color: ''
  },
  '4': {
    texto: '4',
    titulo: '4',
    icono: option,
    clase: 'TagRespuesta TagRespuesta--si',
    color: ''
  },
  '5': {
    texto: '5',
    titulo: '5',
    icono: option,
    clase: 'TagRespuesta TagRespuesta--si',
    color: ''
  },
  PC_PRECIO: {
    texto: 'Consulta precio',
    titulo: 'Paciente consulta por precio',
    icono: option,
    clase: 'TagRespuesta TagRespuesta--vacia',
    color: 'var(--color-bordes)'
  },
  PC_SEGURO: {
    texto: 'Consulta seguro',
    titulo: 'Paciente consulta por seguro de salud',
    icono: option,
    clase: 'TagRespuesta TagRespuesta--vacia',
    color: 'var(--color-bordes)'
  },
  PC_DIRECCION: {
    texto: 'Consulta dirección',
    titulo: 'Paciente consulta por dirección',
    icono: option,
    clase: 'TagRespuesta TagRespuesta--vacia',
    color: 'var(--color-bordes)'
  },
  CONFIRMA_DESPUES: {
    texto: 'Confirma después',
    titulo: 'Paciente indica que confirmará más tarde',
    icono: option,
    clase: 'TagRespuesta TagRespuesta--vacia',
    color: 'var(--color-bordes)'
  },
  RESPUESTA_AUTO: {
    texto: 'RESPUESTA_AUTO',
    titulo: 'RESPUESTA_AUTO',
    icono: option,
    clase: 'TagRespuesta TagRespuesta--vacia',
    color: 'var(--color-bordes)'
  },
  REVERTIR: {
    texto: 'REVERTIR',
    titulo: 'REVERTIR',
    icono: option,
    clase: 'TagRespuesta TagRespuesta--vacia',
    color: 'var(--color-bordes)'
  },
  DATETIME: {
    texto: 'Fecha',
    titulo: 'Fecha',
    icono: check,
    clase: 'TagRespuesta TagRespuesta--si',
    color: ''
  },
  COMUNA: {
    texto: 'Comuna',
    titulo: 'Comuna',
    icono: check,
    clase: 'TagRespuesta TagRespuesta--si',
    color: ''
  },
  'COMUNA-DATETIME': {
    texto: 'Fecha y comuna',
    titulo: 'Fecha y comuna',
    icono: check,
    clase: 'TagRespuesta TagRespuesta--si',
    color: ''
  },
  'action_result:SUCCESS': {
    texto: 'Éxito',
    titulo: 'Éxito',
    icono: check,
    clase: 'TagRespuesta TagRespuesta--si',
    color: ''
  },
  'action_result:FAILURE': {
    texto: 'Error',
    titulo: 'Error',
    icono: cancel,
    clase: 'TagRespuesta TagRespuesta--no',
    color: ''
  }
}

const diccionarioTags = tag => tags[tag] || ({
  texto: tag,
  titulo: tag,
  icono: option,
  clase: 'TagRespuesta TagRespuesta--vacia',
  color: 'var(--color-bordes)'
})

export default diccionarioTags