import { format } from "date-fns"
import { extraerTextoHeader } from "./respuestas"

export const exportarTablaRespuestas = (headers, respuestas, nombre, fechaInicio, fechaTermino) => {
  const headersCSV = headers.map(h => h.texto).join(';')
  const respuestasCSV = respuestas.map(r => headers.map(h => extraerTextoHeader(h, r)).join(';')).join('\n')
  const texto = `${headersCSV}\n${respuestasCSV}`
  const nombreArchivo = `Feedback_${nombre}_${format(fechaInicio, 'yyyy-MM-dd')}_${format(fechaTermino, 'yyyy-MM-dd')}.csv`
  const elemento = document.createElement('a')
  elemento.setAttribute('href', `data:text/csv;charset=utf-8,%EF%BB%BF${encodeURIComponent(texto)}`)
  elemento.setAttribute('download', nombreArchivo)
  elemento.style.display = 'none'
  document.body.appendChild(elemento)
  elemento.click()
  document.body.removeChild(elemento)
}