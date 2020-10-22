import check from '@iconify/icons-mdi/check'
import cancel from '@iconify/icons-mdi/close'
import refresh from '@iconify/icons-mdi/refresh'
import question from '@iconify/icons-mdi/question-mark'

export const diccionarioTags = {
  'YES': {
    texto: 'Confirma',
    titulo: 'Confirmaciones',
    icono: check,
    clase: 'TagRespuesta TagRespuesta--si'
  },
  'NO': {
    texto: 'No confirma',
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
    texto: 'No responde',
    titulo: 'Inconclusas',
    icono: question,
    clase: 'TagRespuesta TagRespuesta--out'
  },
  '': {
    texto: '',
    titulo: 'Sin respuesta',
    icono: null,
    clase: 'TagRespuesta'
  },
}