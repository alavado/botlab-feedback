import React, { useEffect, useRef, useState } from 'react'
import classNames from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
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
import GraficosRespuestas from './GraficosRespuestas'
import { fijaScrollTabla } from '../../../../redux/ducks/respuestas'

const respuestasPorPagina = 50

const TablaRespuestas = () => {

  const { headers } = useSelector(state => state.encuestas)
  const [graficosVisibles, setGraficosVisibles] = useState(false)
  const refContenedor = useRef()
  const dispatch = useDispatch()
  const { respuestasVisibles: respuestas, tablaDestacada, scrollTabla } = useSelector(state => state.respuestas)

  const cargando = !respuestas || !headers
  const mostrarResumen = !!(headers?.find(h => h.tipo === 'YESNO'))

  useEffect(() => {
    const ev = window.addEventListener('keydown', e => {
      if (e.ctrlKey && e.altKey && e.key === '0') {
        setGraficosVisibles(val => !val)
      }
    })
    return () => window.removeEventListener('keydown', ev)
  }, [])

  useEffect(() => {
    refContenedor.current.scrollTop = scrollTabla
    return () => dispatch(fijaScrollTabla(refContenedor.current.scrollTop))
  }, [])
  
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
        <div className="TablaRespuestas__contenedor_central">
          {graficosVisibles && <GraficosRespuestas />}
          <div
            className={classNames({
              "TablaRespuestas__contenedor_tabla": true,
              "TablaRespuestas__contenedor_tabla--extendido": !mostrarResumen
            })}
            ref={refContenedor}
          >
            <table className="TablaRespuestas__tabla">
              <HeadTablaRespuestas />
              <BodyTablaRespuestas respuestasPorPagina={respuestasPorPagina} />
            </table>
          </div>
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
