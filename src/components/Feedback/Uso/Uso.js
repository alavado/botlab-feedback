import React, { useEffect, useState } from 'react'
import { uso } from '../../../api/endpoints'
import { subMonths, format, startOfMonth, endOfMonth } from 'date-fns'
import { es } from 'date-fns/locale'
import './Uso.css'

const mesesSelector = 12

const Uso = () => {

  const ultimos6Meses = Array(mesesSelector).fill(0).map((_, i) => subMonths(new Date(), i))
  const [mes, setMes] = useState(0)
  const [filas, setFilas] = useState()

  useEffect(() => {
    const inicioMes = format(startOfMonth(subMonths(new Date(), mes)), 'yyyy-MM-dd')
    const terminoMes = format(endOfMonth(subMonths(new Date(), mes)), 'yyyy-MM-dd')
    uso(inicioMes, terminoMes)
      .then(data => {
        const datosPorEncuesta = data.data.data.map(d => ({
          idEncuesta: d.poll_id,
          nombreEncuesta: d.poll_name,
          enviadas: d.polls_sent,
          respondidas: d.effective_interactions
        })).sort((d1, d2) => d1.enviadas > d2.enviadas ? -1 : 1) 
        const total = datosPorEncuesta.reduce((obj, e) => ({
          ...obj,
          enviadas: obj.enviadas + e.enviadas,
          respondidas: obj.respondidas + e.respondidas
        }), { nombreEncuesta: 'Todas las encuestas', enviadas: 0, respondidas: 0 })
        setFilas([total, ...datosPorEncuesta])
      })
  }, [mes])

  if (!filas) {
    return null
  }

  console.log(filas)

  return (
    <div className="Uso">
      <div className="Uso__superior">
        <h1 className="Uso__titulo">Uso</h1>
        <p className="Uso__explicacion">
          Los costos de aquí incluyen IVA o algo por el estilo, un mensaje explicativo amigable y buena onda.  
        </p>
      </div>
      <div className="Uso__encabezado">
        <select onChange={e => setMes(e.target.value)} className="Uso__selector_periodo">
          {ultimos6Meses.map((mes, i) => (
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
            {filas.map(f => (
              <tr
                className="Uso__fila_tipo_encuesta"
                key={`uso-tipo-${f.idEncuesta}`}
              >
                <td>{f.nombreEncuesta}</td>
                <td>{f.enviadas.toLocaleString('de-DE')}</td>
                <td>{f.respondidas.toLocaleString('de-DE')}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  )
}

export default Uso
