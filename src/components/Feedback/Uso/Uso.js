import React, { useEffect, useState } from 'react'
import { uso } from '../../../api/endpoints'
import { subMonths, format, startOfMonth, endOfMonth, parse } from 'date-fns'
import { es } from 'date-fns/locale'
import Skeleton from 'react-loading-skeleton'
import { PDFDocument, StandardFonts } from 'pdf-lib'
import logoCeroPNG from '../../../assets/images/logo.png'
import Icon from '@iconify/react'
import iconoDescargarPDF from '@iconify/icons-mdi/pdf'
import './Uso.css'
import { useSelector } from 'react-redux'

const mesesSelector = 12

const Uso = () => {

  const [meses, setMeses] = useState([])
  const [mes, setMes] = useState(0)
  const [filas, setFilas] = useState()
  const { nombreUsuario } = useSelector(state => state.login)

  useEffect(() => {
    const inicioMes = format(startOfMonth(subMonths(new Date(), mes)), 'yyyy-MM-dd')
    const terminoMes = format(endOfMonth(subMonths(new Date(), mes)), 'yyyy-MM-dd')
    setFilas(undefined)
    uso(inicioMes, terminoMes)
      .then(data => {
        const datosPorEncuesta = data.data.data.map(d => ({
          idEncuesta: d.poll_id,
          nombreEncuesta: d.poll_name,
          enviadas: d.polls_sent,
          respondidas: d.effective_interactions,
          inicio: d.start
        })).sort((d1, d2) => d1.enviadas > d2.enviadas ? -1 : 1) 
        const total = datosPorEncuesta.reduce((obj, e) => ({
          ...obj,
          enviadas: obj.enviadas + e.enviadas,
          respondidas: obj.respondidas + e.respondidas
        }), { nombreEncuesta: 'Todas las encuestas', enviadas: 0, respondidas: 0 })
        setFilas([total, ...datosPorEncuesta])
        const fechaInicio = parse(
          datosPorEncuesta.map(d => d.inicio).reduce((min, d) => min < d ? min : d),
          'yyyy-MM-dd',
          new Date()
        )
        const meses = []
        for (let i = 0; i < mesesSelector; i++) {
          const fechaMes = subMonths(new Date(), i)
          if (fechaInicio > fechaMes) {
            break
          }
          meses.push(fechaMes)
        }
        setMeses(meses)
      })
  }, [mes])

  const generarPDF = async () => {
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
    const mesInformeFormateado = format(meses[mes], 'MMMM yyyy', { locale: es })
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

  return (
    <div className="Uso">
      <div className="Uso__superior">
        <h1 className="Uso__titulo">Uso</h1>
        <button
          onClick={generarPDF}
          className="Uso__boton_descargar_pdf"
          disabled={!filas}
        >
          <Icon className="Uso__icono_descargar_pdf" icon={iconoDescargarPDF} />
          Descargar PDF
        </button>
      </div>
      <div className="Uso__encabezado">
        <select onChange={e => setMes(e.target.value)} className="Uso__selector_periodo">
          {meses.map((mes, i) => (
            <option
              key={`option-mes-${i}`}
              value={i}
              className="Uso__opcion_mes"
            >
              {format(mes, 'MMMM yyyy', { locale: es })}
            </option>
          ))}
        </select>
        <div className="Uso__actualizacion">
          Actualización: 1 de marzo de 2020, 10:15
        </div>
      </div>
      <div className="Uso__contenedor_tabla">
        <table className="Uso__tabla_uso">
          <thead>
            <tr>
              <th>Encuesta</th>
              <th>Enviadas</th>
              <th>Respondidas</th>
            </tr>
          </thead>
          <tbody>
            {filas?.map((f, i) => (
              <tr
                className="Uso__fila_tipo_encuesta"
                key={`uso-tipo-${f.idEncuesta}`}
              >
                <td>{i > 0 && '➞'} {f.nombreEncuesta}</td>
                <td>{f.enviadas.toLocaleString('de-DE')}</td>
                <td>{f.respondidas.toLocaleString('de-DE')}</td>
              </tr>
              ))
              || 
              <tr className="Uso__fila_tipo_encuesta">
                <td><Skeleton /></td>
                <td><Skeleton /></td>
                <td><Skeleton /></td>
              </tr>
            }
          </tbody>
        </table>

      </div>
    </div>
  )
}

export default Uso
