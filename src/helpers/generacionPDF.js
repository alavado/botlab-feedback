import { PDFDocument, StandardFonts } from 'pdf-lib'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import logoCeroPNG from '../assets/images/logo.png'

export const generarPDFUso = async (filas, mes, nombreUsuario) => {
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage()
  const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  page.moveTo(110, 200)
  const pngBytes = await fetch(logoCeroPNG).then((res) => res.arrayBuffer())
  const pngLogo = await pdfDoc.embedPng(pngBytes)
  const pngDims = pngLogo.scale(0.2)
  page.drawImage(pngLogo, {
    x: 250,
    y: 755,
    width: pngDims.width,
    height: pngDims.height
  })
  const mesInformeFormateado = format(mes, 'MMMM yyyy', { locale: es })
  const fechaHoyFormateada = format(new Date(), 'dd/MM/yyyy')
  page.drawText(`Informe de uso para ${mesInformeFormateado}`, { x: 210, y: 735, size: 12, font: helvetica })
  page.drawText(`Fecha de emisión: ${fechaHoyFormateada}`, { x: 230, y: 720, size: 10, font: helvetica })
  page.drawText('Encuesta'.toUpperCase(), { x: 40, y: 675, size: 10, font: helveticaBold })
  page.drawText('Enviadas'.toUpperCase(), { x: 380, y: 675, size: 10, font: helveticaBold })
  page.drawText('Respondidas'.toUpperCase(), { x: 480, y: 675, size: 10, font: helveticaBold })
  page.drawLine({
    start: { x: 40, y: 670 },
    end: { x: 560, y: 670 }
  })
  page.drawText(`Todas las encuestas de ${nombreUsuario}`, { x: 40, y: 655, size: 10, font: helveticaBold })
  page.drawText(filas[0].enviadas.toLocaleString('de-DE'), { x: 380, y: 655, size: 10, font: helveticaBold })
  page.drawText(filas[0].enviadas.toLocaleString('de-DE'), { x: 480, y: 655, size: 10, font: helveticaBold })
  filas.slice(1).forEach((f, i) => {
    page.drawText(f.nombreEncuesta, { x: 45, y: 630 - 30 * i, size: 10, font: helvetica })
    page.drawText(f.enviadas.toLocaleString('de-DE'), { x: 380, y: 630 - 30 * i, size: 10, font: helvetica })
    page.drawText(f.respondidas.toLocaleString('de-DE'), { x: 480, y: 630 - 30 * i, size: 10, font: helvetica })
  })
  const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true })
  const elemento = document.createElement('a')
  elemento.setAttribute('href', pdfDataUri)
  elemento.setAttribute('download', `Cero - informe uso ${mesInformeFormateado} al ${fechaHoyFormateada}.pdf`)
  elemento.style.display = 'none'
  document.body.appendChild(elemento)
  elemento.click()
  document.body.removeChild(elemento)
}