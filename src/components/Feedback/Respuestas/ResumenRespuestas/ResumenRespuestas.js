import React, { useMemo } from 'react'
import Skeleton from '../../../Skeleton'
import { useDispatch, useSelector } from 'react-redux'
import diccionarioTags from '../../../../helpers/tags'
import { agregaFiltro } from '../../../../redux/ducks/respuestas'
import './ResumenRespuestas.css'
import TagRespuesta from '../TablaRespuestas/TagRespuesta'
import LoaderRespuestas from '../TablaRespuestas/LoaderRespuestas/LoaderRespuestas'
import { obtenerHeaders } from '../../../../helpers/tablaRespuestas'
import { obtenerHeadersConTagsCalculados } from '../../../../helpers/tagsCalculados'

const ResumenRespuestas = ({ cargando }) => {

  const { headers, idEncuestaSeleccionada } = useSelector(state => state.encuestas)
  const { respuestasVisibles: respuestas } = useSelector(state => state.respuestas)
  const dispatch = useDispatch()
  const headersConTagsCalculados = obtenerHeadersConTagsCalculados(headers, idEncuestaSeleccionada)
  const headersOriginales = obtenerHeaders(headers, idEncuestaSeleccionada)
  const primerTag = (headersConTagsCalculados || headersOriginales)?.find(h => h.tipo === 'YESNO')

  const tagsAMostrar = ['YES', 'NO', 'REAGENDA', 'OUT']

  const conteosTags = useMemo(() => {
    if (cargando) {
      return {}
    }
    const primerHeaderYESNO = (headersConTagsCalculados || headersOriginales).find(h => h.tipo === 'YESNO')
    return primerHeaderYESNO
      ? respuestas.reduce((prev, respuesta) => {
          const tagRespuesta = headersConTagsCalculados
            ? primerHeaderYESNO.f(respuesta).tag
            : respuesta[primerHeaderYESNO.nombre].tag
          const indice =  tagsAMostrar.find(t => t === tagRespuesta)
          indice && (prev[indice] = prev[indice] ? prev[indice] + 1 : 1)
          return prev
        }, {})
      : null
  }, [cargando, headersConTagsCalculados, headersOriginales, respuestas])

  let total, conRespuesta, porcentaje
  if (respuestas) {
    total = respuestas.length
    conRespuesta = Object.keys(conteosTags).reduce((prev, k) => prev + conteosTags[k], 0)
    porcentaje = ((100 * conRespuesta / total) || 0)
  }

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
                <div>Respondidas {cargando ? <Skeleton width={70} /> : conRespuesta.toLocaleString('de-DE')} de {cargando ? <Skeleton width={70} /> : total.toLocaleString('de-DE')}</div>
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
                        title={`${porcentaje.toLocaleString('de-DE', { maximumFractionDigits: 1, minimumFractionDigits: 1 })}% de respuestas "${diccionarioTags(tag).texto}"`}
                      >
                        <td>
                          <div
                            className="ResumenRespuestas__tag"
                            onClick={() => dispatch(agregaFiltro({
                              busqueda: diccionarioTags(tag).texto,
                              nombreHeader: primerTag.nombre,
                              textoHeader: primerTag.texto,
                              idEncuesta: idEncuestaSeleccionada
                            }))}
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
