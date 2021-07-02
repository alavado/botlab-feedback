export const extraerTextoHeader = (header, respuesta) => {
  if (header.tipo === 'META') {
    return respuesta[header.nombre]
  }
  else if (header.tipo === 'YESNO') {
    return respuesta[header.nombre].tag
  }
  else if (header.tipo === 'RANGE') {
    return respuesta[header.nombre].tag
  }
  else {
    throw Error(`${header}, ${respuesta}`)
  }
}

export const formatearCampoRespuestas = (texto, tipoCampo) => {
  if (tipoCampo === 'phone') {
    return `${texto.startsWith('56') ? '+' : ''}${texto.slice(-11, -9)} ${texto.slice(-9, -8)} ${texto.slice(-8, -4)} ${texto.slice(-4)}`
  }
  return texto
}