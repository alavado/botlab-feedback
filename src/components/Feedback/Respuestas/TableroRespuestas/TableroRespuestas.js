import { format, getHours, getMinutes, parse, setHours, setMinutes } from 'date-fns'
import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { obtenerHeaders } from '../../../../helpers/tablaRespuestas'
import SelectorRangoFechas from '../SelectorRangoFechas'
import es from 'date-fns/locale/es'
import './TableroRespuestas.css'
import BuscadorRespuestas from '../BuscadorRespuestas'
import classNames from 'classnames'
import { InlineIcon } from '@iconify/react'
import TagRespuesta from '../TablaRespuestas/TagRespuesta'
import ExportadorRespuestas from '../TablaRespuestas/ExportadorRespuestas'
import { useHistory } from 'react-router'
import { fijaOpcionTableroVisible } from '../../../../redux/ducks/opciones'
import Filtros from '../TablaRespuestas/Filtros'
import { agregaFiltro, guardaEstaRespuesta, remueveFiltrosTemporales } from '../../../../redux/ducks/respuestas'
import diccionarioTags from '../../../../helpers/tags'

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

  const { respuestasVisibles: respuestas, cacheInvalido } = useSelector(state => state.respuestas)
  const { headers, idEncuestaSeleccionada } = useSelector(state => state.encuestas)
  const cargando = !respuestas || !headers
  const history = useHistory()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(remueveFiltrosTemporales())
    dispatch(fijaOpcionTableroVisible(true))
  }, [dispatch])

  const respuestasPorEstado = useMemo(() => {
    if (!respuestas || !headers) {
      return []
    }
    try {
      const headersConTagGeneral = obtenerHeaders(headers, idEncuestaSeleccionada)
      const respuestasConEstado = respuestas.map(r => headersConTagGeneral.reduce((obj, h) => ({
        ...obj,
        [h.nombre]: h.f ? h.f(r).tag : r[h.nombre]
      }), { respuestaOriginal: r }))
      const respuestasConDatetime = respuestasConEstado.map(r => {
        const fecha = parse(r.respuestaOriginal.date, 'd \'de\' MMMM', Date.now(), { locale: es })
        const hora = parse(r.respuestaOriginal.time, 'p', Date.now())
        return {
          ...r,
          datetime: setMinutes(setHours(fecha, getHours(hora)), getMinutes(hora)),
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
          conteoConReacciones: respuestas.filter(r => r.respuestaOriginal.reactions.length > 0).length,
          clase,
          porcentaje: `${(100 * (respuestas.length / respuestasConDatetime.length || 0)).toLocaleString('de-DE', { maximumFractionDigits: 1 })}%`
        }
      })
    }
    catch (e) {
      history.push('/')
      return []
    }
  }, [headers, idEncuestaSeleccionada, respuestas, history])

  if (!respuestasPorEstado) {
    return 'Cargando...'
  }

  const clickEnTarjeta = (respuesta, indice, tag) => {
    dispatch(guardaEstaRespuesta([respuesta, indice, tag]))
    dispatch(agregaFiltro({
      busqueda: diccionarioTags(tag).texto,
      nombreHeader: 'tc0',
      textoHeader: 'Respuesta',
      idEncuesta: idEncuestaSeleccionada,
      opciones: {
        filtroImplicito: false,
        titulo: '',
        temporal: true
      }
    }))
    history.push(`/chat/${idEncuestaSeleccionada}/${respuesta.user_id}`)
  }

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
      <div className={classNames({
        'TableroRespuestas__contenedor_tablero': true,
        'TableroRespuestas__contenedor_tablero--cargando': cacheInvalido
      })}>
        <Filtros />
        <div className="TableroRespuestas__contenedor_columnas">
          {respuestasPorEstado.map(({ tag, respuestas, conteo, conteoConReacciones, porcentaje, clase }, i) => (
            <div
              key={`columna-respuestas-${i}`}
              className="TableroRespuestas__columna"
            >
              <div className="TableroRespuestas__encabezado_columna">
                <div className="TableroRespuestas__contenedor_tag">
                  <TagRespuesta tag={tag} /> <p>{conteo} <span className="TableroRespuestas__porcentaje_columna">{porcentaje}</span></p>
                </div>
                <p className="TableroRespuestas__conteo_reactions" title="Número de citas con notas"><InlineIcon icon="mdi:post-it-note-edit" /> {conteoConReacciones}</p>
              </div>
              {respuestas.map((r, j) => (
                <div
                  key={`tarjeta-respuesta-${i}-${j}`}
                  className={classNames({
                    "TableroRespuestas__tarjeta": true,
                    [clase]: true
                  })}
                  onClick={() => clickEnTarjeta(r.respuestaOriginal, j, tag)}
                >
                  <div className="TableroRespuestas__tarjeta_hora">
                    <p>{r.diaSemana}</p>
                    <p>{r.diaMes}</p>
                    <time>{r.respuestaOriginal.time}</time>
                  </div>
                  <div className="TableroRespuestas__tarjeta_datos">
                    <p style={{ fontWeight: 600 }}>{r.respuestaOriginal.name}</p>
                    <p className="TableroRespuestas__tarjeta_dato_secundario"><InlineIcon icon="mdi:tooth-outline" /> {r.respuestaOriginal.dentist_name}</p>
                    <p className="TableroRespuestas__tarjeta_dato_secundario"><InlineIcon icon="mdi:domain" /> {r.respuestaOriginal.sucursal_name}</p>
                  </div>
                  {r.respuestaOriginal.reactions.length > 0 && <p className="TableroRespuestas__tarjeta_reaccion">{r.respuestaOriginal.reactions[0].reaction_emoji}</p>}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TableroRespuestas