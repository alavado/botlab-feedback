import { PDFDocument, StandardFonts } from 'pdf-lib'
import { endOfMonth, format, getMonth, startOfMonth } from 'date-fns'
import { es } from 'date-fns/locale'
import logoCeroPNG from '../assets/images/logo.png'

export const generarPDFUso = async (filas, mes, nombreUsuario) => {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage()
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const helveticaItalic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique)
  page.moveTo(110, 200)
  const pngBytes = await fetch(logoCeroPNG).then((res) => res.arrayBuffer())
  const pngLogo = await pdfDoc.embedPng(pngBytes)
  const pngDims = pngLogo.scale(0.2)
  page.drawImage(pngLogo, {
    x: 250,
    y: 755,
    width: pngDims.width,
    height: pngDims.height,
  })
  const mesInforme = format(mes, 'MMMM yyyy', { locale: es })
  const fechaEmision = format(new Date(), 'dd/MM/yyyy')
  const horaEmision = format(new Date(), 'HH:mm')
  const fechaInicioInforme = format(
    startOfMonth(mes),
    "dd/MM/yyyy 'a las' HH:mm"
  )
  const fechaFinInforme = format(
    getMonth(new Date()) === getMonth(mes) ? new Date() : endOfMonth(mes),
    "dd/MM/yyyy 'a las' HH:mm"
  )
  page.drawText(`Reporte de uso para ${mesInforme}`, {
    x: 210,
    y: 735,
    size: 12,
    font: helveticaBold,
  })
  page.drawText(`Desde el ${fechaInicioInforme} hasta el ${fechaFinInforme}`, {
    x: 155,
    y: 715,
    size: 10,
    font: helvetica,
  })
  page.drawText('Encuesta'.toUpperCase(), {
    x: 40,
    y: 675,
    size: 10,
    font: helveticaBold,
  })
  page.drawText('Enviadas'.toUpperCase(), {
    x: 380,
    y: 675,
    size: 10,
    font: helveticaBold,
  })
  page.drawText('Respondidas'.toUpperCase(), {
    x: 480,
    y: 675,
    size: 10,
    font: helveticaBold,
  })
  page.drawLine({
    start: { x: 40, y: 670 },
    end: { x: 560, y: 670 },
  })
  page.drawText(`Todos los servicios de ${nombreUsuario}`, {
    x: 40,
    y: 655,
    size: 10,
    font: helveticaBold,
  })
  page.drawText(filas[0].enviadas.toLocaleString('de-DE'), {
    x: 380,
    y: 655,
    size: 10,
    font: helveticaBold,
  })
  page.drawText(filas[0].respondidas.toLocaleString('de-DE'), {
    x: 480,
    y: 655,
    size: 10,
    font: helveticaBold,
  })
  filas.slice(1).forEach((f, i) => {
    page.drawText(f.nombreEncuesta, {
      x: 45,
      y: 630 - 30 * i,
      size: 10,
      font: helvetica,
    })
    page.drawText(f.enviadas.toLocaleString('de-DE'), {
      x: 380,
      y: 630 - 30 * i,
      size: 10,
      font: helvetica,
    })
    page.drawText(f.respondidas.toLocaleString('de-DE'), {
      x: 480,
      y: 630 - 30 * i,
      size: 10,
      font: helvetica,
    })
  })
  page.drawText(`Reporte emitido el ${fechaEmision} a las ${horaEmision}.`, {
    x: 220,
    y: 110,
    font: helveticaBold,
    size: 8,
  })
  page.drawText(
    'Este reporte provee una estimación del uso de la plataforma y no es exhaustivo.',
    { x: 160, y: 90, font: helveticaItalic, size: 8 }
  )
  page.drawText(
    'Refiérase a la factura y al resumen mensual que se entrega al final del período para conocer los valores oficiales.',
    { x: 100, y: 75, font: helveticaItalic, size: 8 }
  )
  const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true })
  const elemento = document.createElement('a')
  elemento.setAttribute('href', pdfDataUri)
  elemento.setAttribute('download', `Cero - reporte uso ${mesInforme}.pdf`)
  elemento.style.display = 'none'
  document.body.appendChild(elemento)
  elemento.click()
  document.body.removeChild(elemento)
}
