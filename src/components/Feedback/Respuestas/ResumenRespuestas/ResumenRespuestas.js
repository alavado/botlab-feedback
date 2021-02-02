import React, { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { diccionarioTags } from '../../../../helpers/tags'
import { agregaFiltro } from '../../../../redux/ducks/respuestas'
import TagRespuesta from '../TablaRespuestas/TagRespuesta'
import './ResumenRespuestas.css'

const ResumenRespuestas = () => {

  const { headers } = useSelector(state => state.encuestas)
  const { respuestasVisibles: respuestas } = useSelector(state => state.respuestas)
  const dispatch = useDispatch()
  const primerTag = headers.find(h => h.tipo === 'YESNO')

  const conteosTags = useMemo(() => {
    const tags = Object.keys(diccionarioTags).slice(0, 4)
    const primerHeaderYESNO = headers.find(h => h.tipo === 'YESNO')
    return respuestas.reduce((prev, respuesta) => {
      const indice = tags.find(t => t === respuesta[primerHeaderYESNO.nombre].tag)
      indice && (prev[indice] = prev[indice] ? prev[indice] + 1 : 1)
      return prev
    }, {})
  }, [headers, respuestas])

  if (!conteosTags) {
    return null
  }

  const total = respuestas.length
  const conRespuesta = Object.keys(conteosTags).reduce((prev, k) => prev + conteosTags[k], 0)
  const porcentaje = ((100 * conRespuesta / total) || 0)

  return (
    <div className="ResumenRespuestas">
      <div
        className="ResumenRespuestas__detalle"
        style={{ '--porcentaje-lleno': `${porcentaje}%` }}
      >
        <div className="ResumenRespuestas__detalle_tasa">
          <div>Respondidas {conRespuesta.toLocaleString('de-DE')} / {total.toLocaleString('de-DE')}</div>
          <div className="ResumenRespuestas__porcentaje">
            {porcentaje.toLocaleString('de-DE', { maximumFractionDigits: 1 })}%
          </div>
        </div>
        <table className="ResumenRespuestas__detalle_tabla">
          <tbody>
            {Object.keys(diccionarioTags).slice(0, 4).map(tag => {
              const porcentaje = ((100 * conteosTags[tag] / total) || 0)
              return (
                <tr key={`fila-respuestas-${tag}`}>
                  <td>
                    <div
                      className="ResumenRespuestas__tag"
                      onClick={() => dispatch(agregaFiltro([diccionarioTags[tag].texto, primerTag.nombre, primerTag.texto]))}
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
                    {((100 * conteosTags[tag] / total) || 0).toLocaleString('de-DE', { maximumFractionDigits: 1, minimumFractionDigits: 1 })}%
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ResumenRespuestas
