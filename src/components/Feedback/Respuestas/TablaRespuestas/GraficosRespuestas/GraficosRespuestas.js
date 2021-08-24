import React, { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import './GraficosRespuestas.css'

const GraficosRespuestas = () => {

  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState()
  const { respuestasVisibles: respuestas, categorias } = useSelector(state => state.respuestas)

  const { conteos, maximo } = useMemo(() => {
    if (!categoriaSeleccionada || !respuestas) {
      return { conteos: [], maximo: 0 }
    }
    const cat = categorias.find(c => c.propiedad === categoriaSeleccionada)
    if (!cat) {
      return { conteos: [], maximo: 0 }
    }
    const conteos = cat.niveles
      .map(nivel => {
        const respuestasNivel = respuestas.filter(r => nivel.f(r))
        const conteoSi = respuestasNivel.filter(r => r['0'].tag === 'YES').length
        const conteoNo = respuestasNivel.filter(r => r['0'].tag === 'NO').length
        const conteoReagenda = respuestasNivel.filter(r => r['0'].tag === 'REAGENDA').length
        const conteoOut = respuestasNivel.filter(r => r['0'].tag === 'OUT').length
        const conteoSR = respuestasNivel.filter(r => r['0'].tag === '').length
        return {
          nivel,
          conteoSi,
          conteoNo,
          conteoReagenda,
          conteoOut,
          conteoSR,
          total: conteoSi + conteoNo + conteoReagenda + conteoOut + conteoSR
        }
      })
      // .sort((n1, n2) => {
      //   // if (cat.propiedad === 'time') {
      //   //   if (n1.nivel.length === 7) {
      //   //     n1.nivel = '0' + n1.nivel
      //   //   }
      //   //   if (n2.nivel.length === 7) {
      //   //     n2.nivel = '0' + n2.nivel
      //   //   }
      //   //   if (n1.nivel.indexOf('AM') > 0 && n2.nivel.indexOf('PM') > 0) {
      //   //     return -1
      //   //   }
      //   //   if (n2.nivel.indexOf('AM') > 0 && n1.nivel.indexOf('PM') > 0) {
      //   //     return 1
      //   //   }
      //   //   return n1.nivel > n2.nivel ? 1 : -1
      //   // }
      //   return n1.total > n2.total ? -1 : 1
      // })
    const maximo = Math.max(...conteos.map(c => c.total))
    return { conteos, maximo }
  }, [categoriaSeleccionada, respuestas])

  // cambia c.total por maximo para poder ver el alto de cada barra

  return (
    <div className="GraficosRespuestas">
      <h6>Gráficos secretos para tasa de respuesta</h6>
      <select onChange={e => setCategoriaSeleccionada(e.target.value)}>
        {categorias.map(c => (
          <option value={c.propiedad}>{c.propiedad}</option>
        ))}
      </select>
      <div className="GraficosRespuestas__grafico">
        {conteos.map(c => (
          <div
            className="GraficosRespuestas__barra"
          >
            <div className="GraficosRespuestas__etiqueta_barra">
            </div>
            <div
              className="GraficosRespuesta__subbarra GraficosRespuesta__subbarra--sr"
              style={{ height: `${100 * c.conteoSR / c.total}%` }}
            >
              <span style={{ fontSize: '.5rem' }}>{c.nivel.nombre}</span>
              <span style={{ marginBottom: '.1rem' }}>{`${(100 * (c.total - c.conteoSR) / c.total).toFixed(1)}%`}</span>
            </div>
            <div
              className="GraficosRespuesta__subbarra GraficosRespuesta__subbarra--out"
              style={{ height: `${100 * c.conteoOut / c.total}%` }}
            >
            </div>
            <div
              className="GraficosRespuesta__subbarra GraficosRespuesta__subbarra--reagenda"
              style={{ height: `${100 * c.conteoReagenda / c.total}%` }}
            >
            </div>
            <div
              className="GraficosRespuesta__subbarra GraficosRespuesta__subbarra--no"
              style={{ height: `${100 * c.conteoNo / c.total}%` }}
            >
            </div>
            <div
              className="GraficosRespuesta__subbarra GraficosRespuesta__subbarra--si"
              style={{ height: `${100 * c.conteoSi / c.total}%` }}
            >
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default GraficosRespuestas