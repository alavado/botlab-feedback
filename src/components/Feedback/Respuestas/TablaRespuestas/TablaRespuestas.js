import React from 'react'
import classNames from 'classnames'
import { useSelector } from 'react-redux'
import SelectorRangoFechas from '../SelectorRangoFechas'
import BuscadorRespuestas from '../BuscadorRespuestas'
import iconoCSV from '@iconify/icons-mdi/download-outline'
import Icon from '@iconify/react'
import FooterTablaRespuestas from './FooterTablaRespuestas'
import HeadTablaRespuestas from './HeadTablaRespuestas'
import BodyTablaRespuestas from './BodyTablaRespuestas'
import ExportadorRespuestas from './ExportadorRespuestas'
import ResumenRespuestas from '../ResumenRespuestas'
import Filtros from './Filtros'
import './TablaRespuestas.css'

const respuestasPorPagina = 50

const TablaRespuestas = () => {

  const { headers } = useSelector(state => state.encuestas)
  const { respuestasVisibles: respuestas, tablaDestacada } = useSelector(state => state.respuestas)

  const cargando = !respuestas || !headers
  const mostrarResumen = !!(headers?.find(h => h.tipo === 'YESNO'))

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
      <div className="TablaRespuestas__contenedor">
        <Filtros />
        {mostrarResumen && <ResumenRespuestas cargando={cargando} />}
        <div className={classNames({
          "TablaRespuestas__overlay": true,
          "TablaRespuestas__overlay--activo": tablaDestacada
        })}>
          <div className="TablaRespuestas__contenido_overlay">
            <Icon icon={iconoCSV} />
          </div>
        </div>
        <div className={classNames({
          "TablaRespuestas__contenedor_tabla": true,
          "TablaRespuestas__contenedor_tabla--extendido": !mostrarResumen
        })}>
          <table className="TablaRespuestas__tabla">
            <HeadTablaRespuestas />
            <BodyTablaRespuestas respuestasPorPagina={respuestasPorPagina} />
          </table>
        </div>
        <FooterTablaRespuestas
          cargando={cargando}
          respuestasPorPagina={respuestasPorPagina}
          totalRespuestas={respuestas ? respuestas.length : 0}
        />
      </div>
    </div>
  )
}

export default TablaRespuestas
