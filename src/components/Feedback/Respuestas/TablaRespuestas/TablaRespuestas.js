import React from 'react'
import SelectorRangoFechas from '../SelectorRangoFechas'
import BuscadorRespuestas from '../BuscadorRespuestas'
import LoaderRespuestas from './LoaderRespuestas'
import FooterTablaRespuestas from './FooterTablaRespuestas'
import HeadTablaRespuestas from './HeadTablaRespuestas'
import BodyTablaRespuestas from './BodyTablaRespuestas'
import { useSelector } from 'react-redux'
import './TablaRespuestas.css'
import ExportadorRespuestas from './ExportadorRespuestas'
import ResumenRespuestas from '../ResumenRespuestas'

const respuestasPorPagina = 20

const TablaRespuestas = () => {

  const { headers } = useSelector(state => state.encuestas)
  const { respuestasVisibles: respuestas } = useSelector(state => state.respuestas)

  const cargando = !respuestas || !headers

  return (
    <div className="TablaRespuestas">
      <div className="TablaRespuestas__superior">
        <h1 className="TablaRespuestas__titulo">Respuestas</h1>
        <SelectorRangoFechas />
        <div className="TablaRespuestas__herramientas">
          <BuscadorRespuestas cargando={cargando} />
          <ExportadorRespuestas cargando={cargando} />
        </div>
      </div>
      {cargando
        ? <LoaderRespuestas />
        : <div className="TablaRespuestas__contenedor">
            <ResumenRespuestas />
            <div className="TablaRespuestas__contenedor_tabla">
              <table className="TablaRespuestas__tabla">
                <HeadTablaRespuestas />
                <BodyTablaRespuestas respuestasPorPagina={respuestasPorPagina} />
              </table>
            </div>
            <FooterTablaRespuestas
              respuestasPorPagina={respuestasPorPagina}
              totalRespuestas={respuestas ? respuestas.length : 0}
            />
          </div>
      }
    </div>
  )
}

export default TablaRespuestas
