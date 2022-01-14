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
  else if (header.tipo === 'OPEN') {
    return respuesta[header.nombre]?.tag || respuesta[header.nombre]?.text || ''
  }
  else {
    throw Error(`${header}, ${respuesta}`)
  }
}

export const formatearCampoRespuestas = (texto, tipoCampo) => {
  if (tipoCampo === 'phone') {
    const prefijos = ['56', '52', '55', '59']
    const prefijoTelefono = prefijos.find(p => texto.startsWith(p))
    if (prefijoTelefono) {
      const telefonoSinPrefijo = texto.slice(prefijoTelefono.length)
      return `+${prefijoTelefono} ${telefonoSinPrefijo}`
    }
    return texto
  }
  return texto
}