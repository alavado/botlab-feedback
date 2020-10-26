export const columnaEstaColapsada = (idEncuestaSeleccionada, nombreColumna, columnasColapsadas) => {
  const colapsadasEncuesta = columnasColapsadas.find(({ idEncuesta }) => idEncuesta === idEncuestaSeleccionada)?.columnasColapsadas
  return colapsadasEncuesta && colapsadasEncuesta?.indexOf(nombreColumna) >= 0
}