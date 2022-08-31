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

export const obtenerNombrePacienteAlerta = alerta => {
  if (alerta.meta['Nombre']) {
    return alerta.meta['Nombre'] + (` ${alerta.meta['Apellidos']}` || '')
  }
  if (alerta.meta['Nombre 1']) {
    return alerta.meta['Nombre 1'] + (` ${alerta.meta['Apellidos 1']}` || '')
  }
  if (alerta.meta['name']) {
    return alerta.meta['name']
  }
  if (alerta.meta['patient_name_1']) {
    return alerta.meta['patient_name_1']
  }
  return '-'
}

export const obtenerSucursalAlerta = alerta => {
  if (alerta.meta['sucursal_name_1']) {
    return alerta.meta['sucursal_name_1']
  }
  if (alerta.meta['sucursal_name']) {
    return alerta.meta['sucursal_name']
  }
  return ''
}