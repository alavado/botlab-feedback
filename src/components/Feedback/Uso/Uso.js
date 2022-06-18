import { useEffect, useState } from 'react'
import { uso as usoAPI } from '../../../api/endpoints'
import { subMonths, format, startOfMonth, endOfMonth, parse } from 'date-fns'
import { es } from 'date-fns/locale'
import Skeleton from '../../Skeleton'
import { Icon } from '@iconify/react'
import { useSelector } from 'react-redux'
import { generarPDFUso } from '../../../helpers/generacionPDF'
import './Uso.css'

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
    usoAPI(inicioMes, terminoMes)
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
          if (startOfMonth(fechaInicio) > fechaMes) {
            break
          }
          meses.push(fechaMes)
        }
        setMeses(meses)
      })
  }, [mes])

  return (
    <div className="Uso">
      <div className="Uso__superior">
        <h1 className="Uso__titulo">Uso</h1>
        <button
          onClick={() => generarPDFUso(filas, meses[mes], nombreUsuario)}
          className="Uso__boton_descargar_pdf"
          disabled={!filas}
        >
          <Icon className="Uso__icono_descargar_pdf" icon="mdi:file-download" />
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
