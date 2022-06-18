export const obtenerIconoAlerta = mensaje => {
  switch (mensaje) {
    case 'Número equivocado':
      return 'mdi:cellphone-off'
    case 'Paciente se arrepiente de cancelar su hora':
      return 'mdi:arrow-u-left-bottom-bold'
    case 'Paciente cancela post confirmación':
      return 'mdi:cancel'
    case 'Paciente reagenda post confirmación':
      return 'mdi:edit'
    case 'Paciente tiene pregunta o comentario':
      return 'mdi:chat-question'
    case 'Mensaje post encuesta':
      return 'mdi:chat-processing'
    default:
      return 'mdi:whatsapp'
  }
}

export const obtenerEtiquetaAlerta = mensaje => {
  switch (mensaje) {
    case 'Mensaje post encuesta':
      return 'Mensaje post interacción'
    default:
      return mensaje
  }
}

export const obtenerNombrePaciente = alerta => {
  return alerta.meta['name'] ?? alerta.meta['patient_name_1'] ?? alerta.meta['Nombre'] ?? '-'
}