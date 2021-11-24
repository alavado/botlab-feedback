import { format, getHours, parse, setHours } from 'date-fns'
import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { obtenerHeaders } from '../../../../helpers/tablaRespuestas'
import SelectorRangoFechas from '../SelectorRangoFechas'
import es from 'date-fns/locale/es'
import './TableroRespuestas.css'
import BuscadorRespuestas from '../BuscadorRespuestas'
import classNames from 'classnames'
import iconoDentista from '@iconify/icons-mdi/tooth-outline'
import iconoSucursal from '@iconify/icons-mdi/domain'
import iconoNota from '@iconify/icons-mdi/post-it-note-edit'
import { InlineIcon } from '@iconify/react'
import TagRespuesta from '../TablaRespuestas/TagRespuesta'
import ExportadorRespuestas from '../TablaRespuestas/ExportadorRespuestas'
import { useHistory } from 'react-router'
import { fijaOpcionTableroVisible } from '../../../../redux/ducks/opciones'

const mapeoEstadosTags = [
  {
    estado: 'Sin respuesta',
    tag: 'S/R',
    clase: 'TableroRespuestas__tarjeta--sr'
  },
  {
    estado: 'Confirma',
    tag: 'YES',
    clase: 'TableroRespuestas__tarjeta--si'
  },
  {
    estado: 'No confirma',
    tag: 'NO',
    clase: 'TableroRespuestas__tarjeta--no'
  },
  {
    estado: 'Reagenda',
    tag: 'REAGENDA',
    clase: 'TableroRespuestas__tarjeta--reagenda'
  },
  {
    estado: 'Sistema no entiende',
    tag: 'OUT',
    clase: 'TableroRespuestas__tarjeta--out'
  },
]

const TableroRespuestas = () => {

  const { respuestasVisibles: respuestas } = useSelector(state => state.respuestas)
  const { headers, idEncuestaSeleccionada } = useSelector(state => state.encuestas)
  const cargando = !respuestas || !headers
  const history = useHistory()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fijaOpcionTableroVisible(true))
  }, [])

  const respuestasPorEstado = useMemo(() => {
    if (!respuestas || !headers) {
      return []
    }
    const headersConTagGeneral = obtenerHeaders(headers, idEncuestaSeleccionada)
    const respuestasConEstado = respuestas.map(r => headersConTagGeneral.reduce((obj, h) => ({
      ...obj,
      [h.nombre]: h.f ? h.f(r).tag : r[h.nombre]
    }), {
      reactions: r.reactions,
      user_id: r.user_id
    }))
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
      const respuestas = respuestasConDatetime.filter(r => r.tc0 === (tag === 'S/R' ? '' : tag))
      respuestas.sort((r1, r2) => r1.datetime > r2.datetime ? 1 : -1)
      return {
        estado,
        tag,
        respuestas,
        conteo: respuestas.length,
        conteoConReacciones: respuestas.filter(r => r.reactions.length > 0).length,
        clase,
        porcentaje: `${(100 * (respuestas.length / respuestasConDatetime.length || 0)).toLocaleString('de-DE', { maximumFractionDigits: 1 })}%`
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
        <div className="TablaRespuestas__herramientas">
          <BuscadorRespuestas cargando={cargando} />
          <ExportadorRespuestas cargando={true} />
        </div>
      </div>
      <div className="TableroRespuestas__contenedor_tablero">
        {respuestasPorEstado.map(({ tag, respuestas, conteo, conteoConReacciones, porcentaje, clase }, i) => (
          <div
            key={`columna-respuestas-${i}`}
            className="TableroRespuestas__columna"
          >
            <div className="TableroRespuestas__encabezado_columna">
              <div className="TableroRespuestas__contenedor_tag">
                <TagRespuesta tag={tag} /> <p>{conteo} <span className="TableroRespuestas__porcentaje_columna">{porcentaje}</span></p>
              </div>
              <p className="TableroRespuestas__conteo_reactions" title="Número de citas con notas"><InlineIcon icon={iconoNota} /> {conteoConReacciones}</p>
            </div>
            {respuestas.map((r, j) => (
              <div
                key={`tarjeta-respuesta-${i}-${j}`}
                className={classNames({
                  "TableroRespuestas__tarjeta": true,
                  [clase]: true
                })}
                onDoubleClick={() => history.push(`/chat/${idEncuestaSeleccionada}/${r.user_id}`)}
              >
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
                {r.reactions.length > 0 && <p className="TableroRespuestas__tarjeta_reaccion">{r.reactions[0].reaction_emoji}</p>}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default TableroRespuestas