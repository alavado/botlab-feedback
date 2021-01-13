export const extraerTextoHeader = (header, respuesta) => {
  if (header.tipo === 'META') {
    return respuesta[header.nombre]
  }
  else if (header.tipo === 'YESNO') {
    return respuesta[header.nombre].tag
  }
  else {
    throw Error(`${header}, ${respuesta}`)
  }
}
