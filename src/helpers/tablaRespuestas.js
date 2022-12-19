import { format } from 'date-fns'
import { obtenerHeadersConTagsCalculados } from './tagsCalculados'
import { extraerTextoHeader, formatearCampoRespuestas } from './respuestas'

export const exportarTablaRespuestas = (
  headers,
  respuestas,
  nombre,
  fechaInicio,
  fechaTermino,
  pollId
) => {
  let headersCSV
  let respuestasCSV
  const headersAIncluir = headers.filter((h) =>
    ['META', 'YESNO', 'RANGE', 'OPEN'].includes(h.tipo)
  )
  console.log(respuestas)
  if (respuestas[0].phone) {
    headersCSV = [
      'Teléfono',
      ...headersAIncluir.map((h) => h.texto),
      'URL',
    ].join(';')
    respuestasCSV = respuestas
      .map((r) =>
        [
          formatearCampoRespuestas(r.phone, 'phone'),
          ...headersAIncluir.map((h) => extraerTextoHeader(h, r)),
          `http://feedback.cero.ai/chat/${pollId}/${r.user_id}`,
        ].join(';')
      )
      .join('\n')
  } else {
    headersCSV = [...headersAIncluir.map((h) => h.texto), 'URL'].join(';')
    respuestasCSV = respuestas
      .map((r) => [
        ...headersAIncluir.map((h) => extraerTextoHeader(h, r)),
        `http://feedback.cero.ai/chat/${pollId}/${r.user_id}`,
      ])
      .join(';')
      .join('\n')
  }
  const texto = `${headersCSV}\n${respuestasCSV}`
  const nombreArchivo = `Feedback_${nombre}_${format(
    fechaInicio,
    'dd-MM-yyyy'
  )}_${format(fechaTermino, 'dd-MM-yyyy')}.csv`
  const elemento = document.createElement('a')
  elemento.setAttribute(
    'href',
    `data:text/csv;charset=utf-8,%EF%BB%BF${encodeURIComponent(texto)}`
  )
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
  return (
    obtenerHeadersConTagsCalculados(headers, idEncuesta) || [
      ...headers.filter((h) => h.tipo === 'YESNO'),
      ...headers.filter((h) => h.tipo === 'OPEN'),
      ...headers.filter((h) => h.tipo === 'RANGE'),
      ...headers.filter((h) => !['YESNO', 'RANGE', 'OPEN'].includes(h.tipo)),
    ]
  )
}
