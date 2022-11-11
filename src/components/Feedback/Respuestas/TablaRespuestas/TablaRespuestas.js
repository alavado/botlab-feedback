import { useEffect, useRef } from 'react'
import classNames from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import SelectorRangoFechas from '../SelectorRangoFechas'
import BuscadorRespuestas from '../BuscadorRespuestas'
import { Icon } from '@iconify/react'
import FooterTablaRespuestas from './FooterTablaRespuestas'
import HeadTablaRespuestas from './HeadTablaRespuestas'
import BodyTablaRespuestas from './BodyTablaRespuestas'
import ExportadorRespuestas from './ExportadorRespuestas'
import ResumenRespuestas from '../ResumenRespuestas'
import Filtros from './Filtros'
import './TablaRespuestas.css'
import { fijaScrollTabla } from '../../../../redux/ducks/respuestas'
import { fijaOpcionTableroVisible } from '../../../../redux/ducks/opciones'
import { esRedSalud, tieneAccesoAReportes } from '../../../../helpers/permisos'
import { muestraModal } from '../../../../redux/ducks/configuracion'
import { desactivaTooltip } from '../../../../redux/ducks/novedades'
import useAnalytics from '../../../../hooks/useAnalytics'
import SelectorRangoFechas2 from '../SelectorRangoFechas2'
import BotonActualizar from '../BotonActualizar'

const respuestasPorPagina = 50
const idsEncuestasAgendamiento = [509, 557, 577]

const TablaRespuestas = () => {

  const { headers, idEncuestaSeleccionada } = useSelector(state => state.encuestas)
  const { cuenta } = useSelector(state => state.login)
  const { tooltipVisible } = useSelector(state => state.novedades)
  const refContenedor = useRef()
  const dispatch = useDispatch()
  const { respuestasVisibles: respuestas, tablaDestacada, scrollTabla, cacheInvalido } = useSelector(state => state.respuestas)
  const track = useAnalytics()

  const cargando = !respuestas || !headers
  const mostrarResumen = !!(headers?.find(h => h.tipo === 'YESNO')) && !idsEncuestasAgendamiento.includes(idEncuestaSeleccionada)

  useEffect(() => {
    dispatch(fijaOpcionTableroVisible(false))
    if (refContenedor.current) {
      refContenedor.current.scrollTop = scrollTabla
    }
    const scrollFinal = refContenedor.current?.scrollTop || 0
    return () => dispatch(fijaScrollTabla(scrollFinal))
  }, [dispatch, scrollTabla])

  useEffect(() => track('Feedback', 'Respuestas', 'index'), [track])

  // const mostrarModalConfiguracion = () => {
  //   track('Feedback', 'Respuestas', 'abrirConfiguracion')
  //   dispatch(muestraModal())
  // }
  
  return (
    <div className="TablaRespuestas">
      <div className="TablaRespuestas__superior">
        <h1 className="TablaRespuestas__titulo">
          Respuestas
          {/* <button
            className="TablaRespuestas__boton_configuracion"
            tooltip="Configuración"
            onClick={() => {
              dispatch(desactivaTooltip())
              mostrarModalConfiguracion()
            }}
          >
            <Icon
              className="TablaRespuestas__boton_icono"
              icon="mdi:cog"
            />
            {tooltipVisible && (
              <div className="TablaRespuestas__tooltip_configuracion">
                <h3>Configuración</h3>
                <p>Aquí puedes configurar tu servicio</p>
              </div>
            )}
          </button> */}
          <BotonActualizar />
        </h1>
        {esRedSalud(cuenta) ? <SelectorRangoFechas /> : <SelectorRangoFechas2 />}
        <div className="TablaRespuestas__herramientas">
          <BuscadorRespuestas cargando={cargando} />
          {tieneAccesoAReportes(cuenta) && <ExportadorRespuestas cargando={cargando} />}
        </div>
      </div>
      <div className={classNames({
        'TablaRespuestas__contenedor': true,
        'TablaRespuestas__contenedor--cargando': cacheInvalido,
      })}>
        <Filtros />
        {mostrarResumen && <ResumenRespuestas cargando={cargando} />}
        <div className={classNames({
          "TablaRespuestas__overlay": true,
          "TablaRespuestas__overlay--activo": tablaDestacada
        })}>
          <div className="TablaRespuestas__contenido_overlay">
            <Icon icon="mdi:download-outline" />
          </div>
        </div>
        <div className="TablaRespuestas__contenedor_central">
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
