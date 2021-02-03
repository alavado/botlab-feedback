import check from '@iconify/icons-mdi/check'
import cancel from '@iconify/icons-mdi/close'
import refresh from '@iconify/icons-mdi/arrow-right'
import question from '@iconify/icons-mdi/question-mark'
import time from '@iconify/icons-mdi/timer-sand'

export const diccionarioTags = {
  'YES': {
    texto: 'Sí',
    titulo: 'Confirmaciones',
    icono: check,
    clase: 'TagRespuesta TagRespuesta--si',
    color: 'var(--color-si)'
  },
  'NO': {
    texto: 'No',
    titulo: 'Cancelaciones',
    icono: cancel,
    clase: 'TagRespuesta TagRespuesta--no',
    color: 'var(--color-no)'
  },
  'REAGENDA': {
    texto: 'Reagenda',
    titulo: 'Reagendamientos',
    icono: refresh,
    clase: 'TagRespuesta TagRespuesta--reagenda',
    color: 'var(--color-reagenda)'
  },
  'OUT': {
    texto: 'Out',
    titulo: 'Out',
    icono: question,
    clase: 'TagRespuesta TagRespuesta--out',
    color: 'var(--color-out)'
  },
  'S/R': {
    texto: 'Sin respuesta',
    titulo: 'Sin respuesta',
    icono: time,
    clase: 'TagRespuesta TagRespuesta--vacia',
    color: 'white'
  },
  'DEFAULT': {
    texto: 'Sí',
    titulo: 'Respuestas',
    icono: check,
    clase: 'TagRespuesta TagRespuesta--si',
    color: 'white'
  },
  '': {
    texto: '',
    titulo: '',
    icono: time,
    clase: 'TagRespuesta TagRespuesta--vacia',
    color: 'var(--color-bordes)'
  }
}