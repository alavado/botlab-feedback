import { Link, NavLink } from 'react-router-dom'
import { Icon } from '@iconify/react'
import logo from '../../../assets/images/logo-cero.svg'
import './BarraLateral.css'
import { useSelector } from 'react-redux'
import {
  tieneAccesoAAlertas,
  tieneAccesoAReportes,
} from '../../../helpers/permisos'
import useAnalytics from '../../../hooks/useAnalytics'
import AlertsCount from './AlertsCount'
import useIsLabeler from '../../../hooks/useIsLabeler'

const BarraLateral = () => {
  const { cuenta } = useSelector((state) => state.login)
  const isLabeler = useIsLabeler()
  const track = useAnalytics()

  return (
    <div className="BarraLateral">
      <Link to="/" className="BarraLateral__link_logo">
        <div className="BarraLateral__logo">
          <img
            className="BarraLateral__logo_imagen"
            src={logo}
            alt="Logo Cero.ai"
          />
          {window.location.href.includes('qa') && <p>QA</p>}
          {window.location.href.includes('dev') && <p>DEV</p>}
        </div>
      </Link>
      <div className="BarraLateral__contenedor_links_secciones">
        <NavLink
          className="BarraLateral__link"
          activeClassName="BarraLateral__link--activo"
          to="/"
          exact
          onClick={() => track('Feedback', 'BarraLateral', 'verRespuestas')}
        >
          <Icon icon="mdi:home" />
          <div className="BarraLateral__nombre_seccion">Respuestas</div>
        </NavLink>
        {tieneAccesoAAlertas(cuenta) && (
          <NavLink
            className="BarraLateral__link"
            activeClassName="BarraLateral__link--activo"
            to="/alertas"
            onClick={() => track('Feedback', 'BarraLateral', 'verAlertas')}
          >
            <AlertsCount />
            <Icon icon="mdi:bell" />
            <div className="BarraLateral__nombre_seccion">Alertas</div>
          </NavLink>
        )}
        {/* <NavLink
          className="BarraLateral__link"
          activeClassName="BarraLateral__link--activo"
          to="/preparaciones"
        >
        <Icon icon={preparaciones} />
        <div className="BarraLateral__nombre_seccion">Preparaciones</div>
        </NavLink> */}
        {!isLabeler && (
          <NavLink
            className="BarraLateral__link"
            activeClassName="BarraLateral__link--activo"
            to="/busqueda"
            onClick={() => track('Feedback', 'BarraLateral', 'verBusqueda')}
          >
            <Icon icon="mdi:search" />
            <div className="BarraLateral__nombre_seccion">Búsqueda</div>
          </NavLink>
        )}
        {!isLabeler && (
          <NavLink
            className="BarraLateral__link"
            activeClassName="BarraLateral__link--activo"
            to="/dashboard"
            onClick={() => track('Feedback', 'BarraLateral', 'verDashboard')}
          >
            <Icon icon="mdi:chart-areaspline" />
            <div className="BarraLateral__nombre_seccion">Dashboard</div>
          </NavLink>
        )}
        {tieneAccesoAReportes(cuenta) && !isLabeler && (
          <NavLink
            className="BarraLateral__link"
            activeClassName="BarraLateral__link--activo"
            to="/exportar"
            onClick={() => track('Feedback', 'BarraLateral', 'verExportar')}
          >
            <Icon icon="mdi:table-export" />
            <div className="BarraLateral__nombre_seccion">Reporte</div>
          </NavLink>
        )}
        {!isLabeler && (
          <NavLink
            className="BarraLateral__link"
            activeClassName="BarraLateral__link--activo"
            to="/uso"
            onClick={() => track('Feedback', 'BarraLateral', 'verUso')}
          >
            <Icon icon="mdi:wallet" />
            <div className="BarraLateral__nombre_seccion">Uso</div>
          </NavLink>
        )}
        {!isLabeler && (
          <div className="BarraLateral__fondo">
            <NavLink
              className="BarraLateral__link"
              activeClassName="BarraLateral__link--activo"
              to="/tutoriales"
              onClick={() => track('Feedback', 'BarraLateral', 'verTutoriales')}
            >
              <Icon icon="mdi:play-box-multiple" />
              <div className="BarraLateral__nombre_seccion">Tutoriales</div>
            </NavLink>
          </div>
        )}
      </div>
    </div>
  )
}

export default BarraLateral
