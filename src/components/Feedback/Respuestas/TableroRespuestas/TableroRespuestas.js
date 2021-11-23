import { format, getHours, parse, setHours } from 'date-fns'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { obtenerHeaders } from '../../../../helpers/tablaRespuestas'
import SelectorRangoFechas from '../SelectorRangoFechas'
import es from 'date-fns/locale/es'
import './TableroRespuestas.css'
import BuscadorRespuestas from '../BuscadorRespuestas'
import classNames from 'classnames'
import iconoDentista from '@iconify/icons-mdi/tooth-outline'
import iconoSucursal from '@iconify/icons-mdi/domain'
import { InlineIcon } from '@iconify/react'

const mapeoEstadosTags = [
  {
    estado: 'Sin respuesta',
    tag: '',
    clase: 'TableroRespuestas__tarjeta--sr'
  },
  {
    estado: 'Anula',
    tag: 'NO',
    clase: 'TableroRespuestas__tarjeta--no'
  },
  {
    estado: 'Sistema no entiende',
    tag: 'OUT',
    clase: 'TableroRespuestas__tarjeta--out'
  },
  {
    estado: 'Confirma',
    tag: 'YES',
    clase: 'TableroRespuestas__tarjeta--si'
  },
  {
    estado: 'Reagenda',
    tag: 'REAGENDA',
    clase: 'TableroRespuestas__tarjeta--reagenda'
  },
]

const TableroRespuestas = () => {

  const { respuestasVisibles: respuestas } = useSelector(state => state.respuestas)
  const { headers, idEncuestaSeleccionada } = useSelector(state => state.encuestas)
  const respuestasPorEstado = useMemo(() => {
    if (!respuestas || !headers) {
      return []
    }
    const headersConTagGeneral = obtenerHeaders(headers, idEncuestaSeleccionada)
    const respuestasConEstado = respuestas.map(r => headersConTagGeneral.reduce((obj, h) => ({ ...obj, [h.nombre]: h.f ? h.f(r).tag : r[h.nombre] }), {}))
    const respuestasConDatetime = respuestasConEstado.map(r => {
      const fecha = parse(r.date, 'd \'de\' MMMM', Date.now(), { locale: es })
      const hora = parse(r.time, 'p', Date.now())
      return {
        ...r,
        datetime: setHours(fecha, getHours(hora)),
        diaSemana: format(fecha, 'EEEE', { locale: es }),
        diaMes: format(fecha, 'd MMM', { locale: es })
      }
    })
    return mapeoEstadosTags.map(({ estado, tag, clase }) => {
      const respuestas = respuestasConDatetime.filter(r => r.tc0 === tag)
      respuestas.sort((r1, r2) => r1.datetime > r2.datetime ? 1 : -1)
      return {
        estado,
        respuestas,
        conteo: respuestas.length,
        clase,
        porcentaje: `${(100 * respuestas.length / respuestasConDatetime.length).toLocaleString('de-DE', { maximumFractionDigits: 1 })}%`
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
        <h1 className="TableroRespuestas__titulo">Respuestas</h1>
        <SelectorRangoFechas />
        <BuscadorRespuestas />
      </div>
      <div className="TableroRespuestas__contenedor_tablero">
        {respuestasPorEstado.map(({ estado, respuestas, conteo, porcentaje, clase }) => (
          <div className="TableroRespuestas__columna">
            <h2 className="TableroRespuestas__titulo_columna">{estado} {conteo} ({porcentaje})</h2>
            {respuestas.map(r => (
              <div className={classNames({
                "TableroRespuestas__tarjeta": true,
                [clase]: true
              })}>
                <div className="TableroRespuestas__tarjeta_hora">
                  <p>{r.diaSemana}</p>
                  <p>{r.diaMes}</p>
                  <time>{r.time}</time>
                </div>
                <div className="TableroRespuestas__tarjeta_datos">
                  <p style={{ fontWeight: 600 }}>{r.name}</p>
                  <p className="TableroRespuestas__tarjeta_dato_secundario"><InlineIcon icon={iconoDentista} /> {r.dentist_name}</p>
                  <p className="TableroRespuestas__tarjeta_dato_secundario"><InlineIcon icon={iconoSucursal} /> {r.sucursal_name}</p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default TableroRespuestas