import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import './ResumenRespuestas.css'

const ResumenRespuestas = () => {

  const { headers } = useSelector(state => state.encuestas)
  const { respuestasVisibles: respuestas } = useSelector(state => state.respuestas)

  const [total, si, no, out, reagenda] = useMemo(() => {
    const primerHeaderYESNO = headers.find(h => h.tipo === 'YESNO')
    const tags = ['YES', 'NO', 'OUT', 'REAGENDA']
    return [respuestas.length, ...respuestas.reduce((prev, respuesta) => {
      const indice = tags.findIndex(t => t === respuesta[primerHeaderYESNO.nombre].tag)
      if (indice >= 0) {
        prev[indice]++
      }
      else {
        prev[prev.length - 1]++
      }
      return prev
    }, [0, 0, 0, 0, 0])]
  }, [headers, respuestas])

  const porcentaje = (100 * (si + no + out + reagenda) / total).toFixed(1)

  return (
    <div className="ResumenRespuestas">
      Tasa de respuesta: <span className="ResumenRespuestas__porcentaje">{porcentaje}%</span>
      <div className="ResumenRespuestas__barras">
        <div
          className="ResumenRespuestas__barra ResumenRespuestas__barra--si"
          // style={{ width: `${100 * si / total}%` }}
        >
          {si}
        </div>
        <div
          className="ResumenRespuestas__barra ResumenRespuestas__barra--no"
          // style={{ width: `${100 * no / total}%` }}
        >
          {no}
        </div>
        <div
          className="ResumenRespuestas__barra ResumenRespuestas__barra--reagenda"
          // style={{ width: `${100 * reagenda / total}%` }}
        >
          {reagenda}
        </div>
        <div
          className="ResumenRespuestas__barra ResumenRespuestas__barra--out"
          // style={{ width: `${100 * out / total}%` }}
        >
          {out}
        </div>
      </div>
    </div>
  )
}

export default ResumenRespuestas
