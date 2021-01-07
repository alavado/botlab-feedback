import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { diccionarioTags } from '../../../../helpers/tags'
import TagRespuesta from '../TablaRespuestas/TagRespuesta'
import './ResumenRespuestas.css'

const ResumenRespuestas = () => {

  const { headers } = useSelector(state => state.encuestas)
  const { respuestasVisibles: respuestas } = useSelector(state => state.respuestas)

  const conteosTags = useMemo(() => {
    const primerHeaderYESNO = headers.find(h => h.tipo === 'YESNO')
    const tags = Object.keys(diccionarioTags)
    return respuestas.reduce((prev, respuesta) => {
      const indice = tags.find(t => t === respuesta[primerHeaderYESNO.nombre].tag)
      if (indice) {
        if (!prev[indice]) {
          prev[indice] = 0
        }
        prev[indice]++
      }
      return prev
    }, {})
  }, [headers, respuestas])

  const [l, setL] = useState(0)
  const [w, setW] = useState(0)

  useEffect(() => {
    const f = () => {
      setL(() => {
        return document.getElementsByClassName('ResumenRespuestas__porcentaje')[0]?.getBoundingClientRect().left - document.getElementsByClassName('ResumenRespuestas__porcentaje')[0]?.clientWidth
      })
      setW(() => {
        console.log(document.getElementsByClassName('ResumenRespuestas__detalle_tabla')[0]?.getBoundingClientRect().width)
        return document.getElementsByClassName('ResumenRespuestas')[0]?.getBoundingClientRect().width - document.getElementsByClassName('ResumenRespuestas__detalle_tabla')[0]?.getBoundingClientRect().width
      })
    }
    window.addEventListener('resize', f)
  }, [])
  const total = respuestas.length
  const conRespuesta = Object.keys(conteosTags).reduce((prev, k) => prev + conteosTags[k], 0)
  const porcentaje = ((100 * conRespuesta / total) || 0)

  return (
    <div className="ResumenRespuestas">
      {/* <div className="ResumenRespuestas__tasa">
        <div>Enviadas {total.toLocaleString('de-DE')}</div>
        <div className="ResumenRespuestas__porcentaje">100%</div>
      </div> */}
      <div
        className="ResumenRespuestas__detalle"
        style={{ '--porcentaje-lleno': `${porcentaje}%` }}
      >
        <div className="ResumenRespuestas__detalle_tasa">
          <svg
            className="ResumenRespuestas__sankey"
            viewBox="0 0 100 100"
            style={{
              left: l,
              width: w
            }}
          >
            <path d="M0,0 L100,100" />
          </svg>
          <div>Respondidas {conRespuesta.toLocaleString('de-DE')} / {total.toLocaleString('de-DE')}</div>
          <div className="ResumenRespuestas__porcentaje">
            {porcentaje.toLocaleString('de-DE', { maximumFractionDigits: 1 })}%
          </div>
        </div>
        <table className="ResumenRespuestas__detalle_tabla">
          <tbody>
            {Object.keys(diccionarioTags).slice(0, 4).map(tag => (
              <tr key={`fila-respuestas-${tag}`}>
                <td><div className="ResumenRespuestas__tag"><TagRespuesta tag={tag} /></div></td>
                <td>{conteosTags[tag]?.toLocaleString('de-DE') || 0}</td>
                <td>{((100 * conteosTags[tag] / total) || 0).toLocaleString('de-DE', { maximumFractionDigits: 1, minimumFractionDigits: 1 })}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ResumenRespuestas
