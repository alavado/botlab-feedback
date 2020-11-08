import { extraerTextoHeader } from "./respuestas"

export const columnaEstaColapsada = (idEncuestaSeleccionada, nombreColumna, columnasColapsadas) => {
  const colapsadasEncuesta = columnasColapsadas.find(({ idEncuesta }) => idEncuesta === idEncuestaSeleccionada)?.columnasColapsadas
  return colapsadasEncuesta && colapsadasEncuesta?.indexOf(nombreColumna) >= 0
}

export const exportarTablaRespuestas = (headers, respuestas) => {
  const headersCSV = headers.map(h => h.texto).join(',')
  const respuestasCSV = respuestas.map(r => headers.map(h => extraerTextoHeader(h, r)).join(',')).join('\n')
  const texto = `${headersCSV}\n${respuestasCSV}`
  const nombreArchivo = 'feedback.csv'
  const elemento = document.createElement('a')
  elemento.setAttribute('href', `data:text/plaincharset=utf-8,${encodeURIComponent(texto)}`)
  elemento.setAttribute('download', nombreArchivo)
  elemento.style.display = 'none'
  document.body.appendChild(elemento)
  elemento.click()
  document.body.removeChild(elemento)
}