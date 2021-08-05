import React, { useMemo } from 'react'
import Skeleton from '../../../Skeleton'
import { useDispatch, useSelector } from 'react-redux'
import diccionarioTags from '../../../../helpers/tags'
import { agregaFiltro } from '../../../../redux/ducks/respuestas'
import TagRespuesta from '../TablaRespuestas/TagRespuesta'
import './ResumenRespuestas.css'
import LoaderRespuestas from '../TablaRespuestas/LoaderRespuestas/LoaderRespuestas'
import { obtenerHeaders } from '../../../../helpers/tablaRespuestas'

const ResumenRespuestas = ({ cargando }) => {

  const { headers, idEncuestaSeleccionada } = useSelector(state => state.encuestas)
  const { respuestasVisibles: respuestas } = useSelector(state => state.respuestas)
  const dispatch = useDispatch()
  const primerTag = obtenerHeaders(headers, idEncuestaSeleccionada)?.find(h => h.tipo === 'YESNO')

  const conteosTags = useMemo(() => {
    if (cargando) {
      return {}
    }
    const tags = Object.keys(diccionarioTags).slice(0, 4)
    const primerHeaderYESNO = headers.find(h => h.tipo === 'YESNO')
    return primerHeaderYESNO
      ? respuestas.reduce((prev, respuesta) => {
          const indice = tags.find(t => t === respuesta[primerHeaderYESNO.nombre].tag)
          indice && (prev[indice] = prev[indice] ? prev[indice] + 1 : 1)
          return prev
        }, {})
      : null
  }, [cargando, headers, respuestas])

  let total, conRespuesta, porcentaje
  if (respuestas) {
    total = respuestas.length
    conRespuesta = Object.keys(conteosTags).reduce((prev, k) => prev + conteosTags[k], 0)
    porcentaje = ((100 * conRespuesta / total) || 0)
  }

  const tagsAMostrar = Object.keys(diccionarioTags).slice(0, 4)

  return (
    <div className="ResumenRespuestas">
      <div
        className="ResumenRespuestas__detalle"
        style={{ '--porcentaje-lleno': `${porcentaje}%` }}
      >
        {cargando
          ? <LoaderRespuestas />
          : <>
              <div className="ResumenRespuestas__detalle_tasa">
                <div>Respondidas {cargando ? <Skeleton width={70} /> : conRespuesta.toLocaleString('de-DE')} / {cargando ? <Skeleton width={70} /> : total.toLocaleString('de-DE')}</div>
                <div className="ResumenRespuestas__porcentaje">
                  {porcentaje.toLocaleString('de-DE', { maximumFractionDigits: 1 })}%
                </div>
              </div>
              <table className="ResumenRespuestas__detalle_tabla">
                <tbody>
                  {tagsAMostrar.map(tag => {
                    const porcentaje = ((100 * conteosTags[tag] / total) || 0)
                    return (
                      <tr
                        key={`fila-respuestas-${tag}`}
                        title={`${porcentaje.toLocaleString('de-DE', { maximumFractionDigits: 1, minimumFractionDigits: 1 })}% de respuestas "${diccionarioTags[tag].texto}"`}
                      >
                        <td>
                          <div
                            className="ResumenRespuestas__tag"
                            onClick={() => dispatch(agregaFiltro([diccionarioTags[tag].texto, primerTag.nombre, primerTag.texto, idEncuestaSeleccionada]))}
                          >
                            <TagRespuesta tag={tag} />
                          </div>
                        </td>
                        <td
                          className="ResumenRespuestas__celda_barra"
                          style={{ '--porcentaje-lleno': `${Math.min(100, 2 * porcentaje)}%` }}
                        >
                          {conteosTags[tag]?.toLocaleString('de-DE') || 0}</td>
                        <td
                          className="ResumenRespuestas__celda_barra"
                          style={{ '--porcentaje-lleno': `${Math.max(0, 2 * porcentaje - 100)}%` }}
                        >
                          {porcentaje.toLocaleString('de-DE', { maximumFractionDigits: 1, minimumFractionDigits: 1 })}%
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </>
          }
      </div>
    </div>
  )
}

export default ResumenRespuestas
