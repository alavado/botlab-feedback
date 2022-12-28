import { format } from 'date-fns'
import { obtenerHeadersConTagsCalculados } from './tagsCalculados'
import { extraerTextoHeader, formatearCampoRespuestas } from './respuestas'
import { writeFileXLSX, utils } from 'xlsx'

export const exportarTablaRespuestas = async (
  headers,
  respuestas,
  nombre,
  fechaInicio,
  fechaTermino,
  pollId,
  formato = 'csv'
) => {
  const nombreArchivo = `Feedback_${nombre}_${format(
    fechaInicio,
    'dd-MM-yyyy'
  )}_${format(fechaTermino, 'dd-MM-yyyy')}.${formato}`
  const headersAIncluir = headers.filter((h) =>
    ['META', 'YESNO', 'RANGE', 'OPEN'].includes(h.tipo)
  )
  if (formato === 'xlsx') {
    let headersXLSX
    let filasXLSX
    if (respuestas[0].phone) {
      headersXLSX = ['Teléfono', ...headersAIncluir.map((h) => h.texto), 'URL']
      filasXLSX = respuestas.map((r) => [
        formatearCampoRespuestas(r.phone, 'phone'),
        ...headersAIncluir.map((h) => extraerTextoHeader(h, r)),
        `https://feedback.cero.ai/chat/${pollId}/${r.user_id}`,
      ])
    } else {
      headersXLSX = [...headersAIncluir.map((h) => h.texto), 'URL']
      filasXLSX = respuestas.map((r) => [
        ...headersAIncluir.map((h) => extraerTextoHeader(h, r)),
        `https://feedback.cero.ai/chat/${pollId}/${r.user_id}`,
      ])
    }
    const data = [headersXLSX, ...filasXLSX]
    var workbook = utils.book_new()
    var ws = utils.aoa_to_sheet(data)
    filasXLSX.forEach((fila, i) => {
      ws[utils.encode_cell({ r: i + 1, c: headersXLSX.length - 1 })].l = {
        Target: fila.slice(-1)[0],
        Tooltip: fila.slice(-1)[0],
      }
    })
    utils.book_append_sheet(workbook, ws, 'x')
    writeFileXLSX(workbook, nombreArchivo)
  } else {
    let headersCSV
    let respuestasCSV
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
            `https://feedback.cero.ai/chat/${pollId}/${r.user_id}`,
          ].join(';')
        )
        .join('\n')
    } else {
      headersCSV = [...headersAIncluir.map((h) => h.texto), 'URL'].join(';')
      respuestasCSV = respuestas
        .map((r) => [
          ...headersAIncluir.map((h) => extraerTextoHeader(h, r)),
          `https://feedback.cero.ai/chat/${pollId}/${r.user_id}`,
        ])
        .join(';')
        .join('\n')
    }
    const texto = `${headersCSV}\n${respuestasCSV}`
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
