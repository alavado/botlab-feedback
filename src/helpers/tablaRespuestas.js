import { format } from 'date-fns'
import { obtenerHeadersConTagsCalculados } from './tagsCalculados'
import { extraerTextoHeader, formatearCampoRespuestas } from './respuestas'
import { writeFile, utils } from 'xlsx-js-style'
import _ from 'lodash'

const extraerUltimoComentario = (respuesta) => {
  let comentarios = _.cloneDeep(respuesta.reactions)
  comentarios.sort((r1, r2) => (r1.created_at > r2.created_at ? -1 : 1))
  if (comentarios[0]) {
    return `${comentarios[0]?.reaction_emoji} ${comentarios[0]?.reaction_text}`
  }
  return ''
}

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
    ['META', 'YESNO', 'RANGE', 'OPEN', 'ICON'].includes(h.tipo)
  )
  if (formato === 'xlsx') {
    let headersXLSX
    let filasXLSX
    if (respuestas[0].phone) {
      headersXLSX = [
        'Último Comentario',
        'Teléfono',
        ...headersAIncluir.map((h) => h.texto),
        'Link',
      ]
      filasXLSX = respuestas.map((r) => [
        extraerUltimoComentario(r),
        formatearCampoRespuestas(r.phone, 'phone'),
        ...headersAIncluir.map((h) => extraerTextoHeader(h, r)),
        `https://feedback.cero.ai/chat/${pollId}/${r.user_id}`,
      ])
    } else {
      headersXLSX = [
        'Último Comentario',
        ...headersAIncluir.map((h) => h.texto),
        'Link',
      ]
      filasXLSX = respuestas.map((r) => [
        extraerUltimoComentario(r),
        ...headersAIncluir.map((h) => extraerTextoHeader(h, r)),
        `https://feedback.cero.ai/chat/${pollId}/${r.user_id}`,
      ])
    }
    const data = [headersXLSX, ...filasXLSX]
    const workbook = utils.book_new()
    const worksheet = utils.aoa_to_sheet(data)
    headersXLSX.forEach((_, i) => {
      const cell = worksheet[utils.encode_cell({ r: 0, c: i })]
      cell.s = { font: { bold: true } }
    })
    filasXLSX.forEach((fila, i) => {
      const cell =
        worksheet[utils.encode_cell({ r: i + 1, c: headersXLSX.length - 1 })]
      cell.l = {
        Target: fila.slice(-1)[0],
        Tooltip: 'Abrir Chat en Feedback',
      }
      cell.s = { font: { color: { rgb: '2017d9' }, underline: true } }
    })
    let objectMaxLength = []
    data.forEach((arr) => {
      Object.keys(arr).forEach((key) => {
        let value = arr[key] === null ? '' : arr[key]
        if (typeof value === 'number') {
          return (objectMaxLength[key] = 10)
        }
        objectMaxLength[key] =
          objectMaxLength[key] >= value.length
            ? objectMaxLength[key]
            : value.length
      })
    })
    worksheet['!cols'] = objectMaxLength.map((width) => ({ width }))
    utils.book_append_sheet(workbook, worksheet, 'Exportación Feedback')
    writeFile(workbook, nombreArchivo)
  } else {
    let headersCSV
    let respuestasCSV
    if (respuestas[0].phone) {
      headersCSV = [
        'Teléfono',
        ...headersAIncluir.map((h) => h.texto),
        'Link',
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
      headersCSV = [...headersAIncluir.map((h) => h.texto), 'Link'].join(';')
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
