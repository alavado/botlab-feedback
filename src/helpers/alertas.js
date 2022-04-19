import iconoWhatsapp from '@iconify/icons-mdi/whatsapp'
import iconoNumeroEquivocado from '@iconify/icons-mdi/cellphone-off'
import iconoPacienteArrepentido from '@iconify/icons-mdi/arrow-u-left-bottom-bold'
import iconoCancelaPostConfirmacion from '@iconify/icons-mdi/cancel'
import iconoReagendaPostConfirmacion from '@iconify/icons-mdi/edit'
import iconoPregunta from '@iconify/icons-mdi/chat-question'

export const obtenerIconoAlerta = mensaje => {
  switch (mensaje) {
    case 'Número equivocado':
      return iconoNumeroEquivocado
    case 'Paciente se arrepiente de cancelar su hora':
      return iconoPacienteArrepentido
    case 'Paciente cancela post confirmación':
      return iconoCancelaPostConfirmacion
    case 'Paciente reagenda post confirmación':
      return iconoReagendaPostConfirmacion
    case 'Paciente tiene pregunta o comentario':
      return iconoPregunta
    default:
      return iconoWhatsapp
  }
}