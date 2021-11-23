import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { obtenerHeaders } from '../../../../helpers/tablaRespuestas'
import SelectorRangoFechas from '../SelectorRangoFechas'
import './TableroRespuestas.css'

const mapeoEstadosTags = [
  {
    estado: 'Sin respuesta',
    tag: ''
  },
  {
    estado: 'Anula',
    tag: 'NO'
  },
  {
    estado: 'Sistema no entiende',
    tag: 'OUT'
  },
  {
    estado: 'Confirma',
    tag: 'YES'
  },
  {
    estado: 'Reagenda',
    tag: 'REAGENDA'
  },
]

const TableroRespuestas = () => {

  const { respuestasVisibles: respuestas } = useSelector(state => state.respuestas)
  const { headers, idEncuestaSeleccionada } = useSelector(state => state.encuestas)
  const respuestasPorEstado = useMemo(() => {
    if (!respuestas) {
      return []
    }
    const headersConTagGeneral = obtenerHeaders(headers, idEncuestaSeleccionada)
    const respuestasConEstado = respuestas.map(r => headersConTagGeneral.reduce((obj, h) => ({ ...obj, [h.nombre]: h.f ? h.f(r).tag : r[h.nombre] }), {}))
    return mapeoEstadosTags.map(({ estado, tag }) => {
      const respuestas = respuestasConEstado.filter(r => r.tc0 === tag)
      return {
        estado,
        respuestas,
        conteo: respuestas.length,
        porcentaje: `${(100 * respuestas.length / respuestasConEstado.length).toLocaleString('de-DE', { maximumFractionDigits: 1 })}%`
      }
    })
  }, [headers, idEncuestaSeleccionada, respuestas])

  if (!respuestasPorEstado) {
    return 'Cargando...'
  }

  console.log(respuestasPorEstado)

  return (
    <div className="TableroRespuestas">
      <div className="TableroRespuestas__superior">
        <h1>Respuestas</h1>
        <SelectorRangoFechas />
        <h1></h1>
      </div>
      <div className="TableroRespuestas__contenedor_tablero">
        {respuestasPorEstado.map(({ estado, respuestas, conteo, porcentaje }) => (
          <div className="TableroRespuestas__columna">
            <h2 className="TableroRespuestas__titulo_columna">{estado} {conteo} ({porcentaje})</h2>
            {respuestas.map(r => (
              <div className="TableroRespuestas__tarjeta">{r.name}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default TableroRespuestas