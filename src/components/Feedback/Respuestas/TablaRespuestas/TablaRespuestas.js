import React, { useState, useEffect } from 'react'
import SelectorRangoFechas from '../SelectorRangoFechas'
import BuscadorRespuestas from '../BuscadorRespuestas'
import LoaderRespuestas from './LoaderRespuestas'
import FooterTablaRespuestas from './FooterTablaRespuestas'
import HeadTablaRespuestas from './HeadTablaRespuestas'
import BodyTablaRespuestas from './BodyTablaRespuestas'
import { useSelector } from 'react-redux'
import './TablaRespuestas.css'
import ExportadorRespuestas from './ExportadorRespuestas'

const respuestasPorPagina = 20

const TablaRespuestas = () => {

  const [pagina, setPagina] = useState(1)
  const { headers } = useSelector(state => state.encuestas)
  const { respuestasVisibles: respuestas } = useSelector(state => state.respuestas)

  useEffect(() => setPagina(1), [respuestas])

  const cargando = !respuestas || !headers

  return (
    <div className="TablaRespuestas">
      <div className="TablaRespuestas__superior">
        <h1 className="TablaRespuestas__titulo">Respuestas</h1>
        <SelectorRangoFechas />
        <div className="TablaRespuestas__herramientas">
          <BuscadorRespuestas />
          <ExportadorRespuestas />
        </div>
      </div>
      {cargando
        ? <LoaderRespuestas />
        : <>
            <div className="TablaRespuestas__contenedor_tabla">
              <table className="TablaRespuestas__tabla">
                <HeadTablaRespuestas />
                <BodyTablaRespuestas
                  respuestasPorPagina={respuestasPorPagina}
                  pagina={pagina}
                />
              </table>
            </div>
            <FooterTablaRespuestas
              respuestasPorPagina={respuestasPorPagina}
              totalRespuestas={respuestas ? respuestas.length : 0}
              pagina={pagina}
              setPagina={setPagina}
            />
          </>
      }
    </div>
  )
}

export default TablaRespuestas
