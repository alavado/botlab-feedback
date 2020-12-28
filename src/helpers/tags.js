import check from '@iconify/icons-mdi/check'
import cancel from '@iconify/icons-mdi/close'
import refresh from '@iconify/icons-mdi/arrow-right'
import question from '@iconify/icons-mdi/question-mark'

export const diccionarioTags = {
  'YES': {
    texto: 'Sí',
    titulo: 'Confirmaciones',
    icono: check,
    clase: 'TagRespuesta TagRespuesta--si'
  },
  'NO': {
    texto: 'No',
    titulo: 'Cancelaciones',
    icono: cancel,
    clase: 'TagRespuesta TagRespuesta--no'
  },
  'REAGENDA': {
    texto: 'Reagenda',
    titulo: 'Reagendamientos',
    icono: refresh,
    clase: 'TagRespuesta TagRespuesta--reagenda'
  },
  'OUT': {
    texto: 'Out',
    titulo: 'Out',
    icono: question,
    clase: 'TagRespuesta TagRespuesta--out'
  },
  'DEFAULT': {
    texto: 'Responde',
    titulo: 'Responde',
    icono: check,
    clase: 'TagRespuesta TagRespuesta--si'
  },
  '': {
    texto: '',
    titulo: 'Sin respuesta',
    icono: null,
    clase: 'TagRespuesta'
  },
}