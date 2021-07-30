import { format } from "date-fns"
import { obtenerHeadersCalculados } from "./headersCalculados"
import { extraerTextoHeader, formatearCampoRespuestas } from "./respuestas"

export const exportarTablaRespuestas = (headers, respuestas, nombre, fechaInicio, fechaTermino) => {
  let headersCSV
  let respuestasCSV
  if (respuestas[0].phone) {
    headersCSV = ['Teléfono', ...headers.map(h => h.texto)].join(';')
    respuestasCSV = respuestas.map(r => [formatearCampoRespuestas(r.phone, 'phone'), ...headers.map(h => extraerTextoHeader(h, r))].join(';')).join('\n')
  }
  else {
    headersCSV = headers.map(h => h.texto).join(';')
    respuestasCSV = respuestas.map(r => headers.map(h => extraerTextoHeader(h, r)).join(';')).join('\n')
  }
  const texto = `${headersCSV}\n${respuestasCSV}`
  const nombreArchivo = `Feedback_${nombre}_${format(fechaInicio, 'dd-MM-yyyy')}_${format(fechaTermino, 'dd-MM-yyyy')}.csv`
  const elemento = document.createElement('a')
  elemento.setAttribute('href', `data:text/csv;charset=utf-8,%EF%BB%BF${encodeURIComponent(texto)}`)
  elemento.setAttribute('download', nombreArchivo)
  elemento.style.display = 'none'
  document.body.appendChild(elemento)
  elemento.click()
  document.body.removeChild(elemento)
}

export const obtenerHeaders = (headers, idEncuesta) => {
  if (!headers) {
    return null
  }
  return obtenerHeadersCalculados(headers, idEncuesta) ||
  [
    ...headers.filter(h => h.tipo === 'YESNO'),
    ...headers.filter(h => h.tipo === 'OPEN'),
    ...headers.filter(h => h.tipo === 'RANGE'),
    ...headers.filter(h => !['YESNO', 'RANGE', 'OPEN'].includes(h.tipo))
  ]
}
