import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Icon, InlineIcon } from '@iconify/react'
import search from '@iconify/icons-mdi/search'
import alertas from '@iconify/icons-mdi/robot'
import iconoSinAlertas from '@iconify/icons-mdi/robot-happy'
import exportar from '@iconify/icons-mdi/table-export'
import usage from '@iconify/icons-mdi/wallet'
import home from '@iconify/icons-mdi/home'
import tutoriales from '@iconify/icons-mdi/play-box-multiple'
import iconoCerrar from '@iconify/icons-mdi/close'
// import preparaciones from '@iconify/icons-mdi/clipboard-check'
import logo from '../../../assets/images/logo-cero.svg'
import './BarraLateral.css'
import { useDispatch, useSelector } from 'react-redux'
import ConteoAlertas from './ConteoAlertas'
import { tieneAccesoAAlertas, tieneAccesoAReportes } from '../../../helpers/permisos'
import { marcaVisto } from '../../../redux/ducks/tutoriales'

const BarraLateral = () => {

  const { cuenta } = useSelector(state => state.login)
  const { visto } = useSelector(state => state.tutoriales)
  const [feliz, setFeliz] = useState(false)
  const dispatch = useDispatch()
  
  return (
    <div className="BarraLateral">
      <Link
        to="/"
        className="BarraLateral__link_logo"
      >
        <div className="BarraLateral__logo">
          <img className="BarraLateral__logo_imagen" src={logo} alt="Logo Cero.ai" />
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
        >
          <Icon icon={home} />
          <div className="BarraLateral__nombre_seccion">Respuestas</div>
        </NavLink>
        {tieneAccesoAAlertas(cuenta) &&
          <NavLink
            className="BarraLateral__link"
            activeClassName="BarraLateral__link--activo"
            to="/alertas"
          >
            <ConteoAlertas setFeliz={setFeliz} />
            <Icon icon={feliz ? iconoSinAlertas : alertas} />
            <div className="BarraLateral__nombre_seccion">Alertas</div>
          </NavLink>
        }
        {/* <NavLink
          className="BarraLateral__link"
          activeClassName="BarraLateral__link--activo"
          to="/preparaciones"
        >
        <Icon icon={preparaciones} />
        <div className="BarraLateral__nombre_seccion">Preparaciones</div>
        </NavLink> */}
        {tieneAccesoAReportes(cuenta) && (
          <NavLink
            className="BarraLateral__link"
            activeClassName="BarraLateral__link--activo"
            to="/exportar"
          >
            <Icon icon={exportar} />
            <div className="BarraLateral__nombre_seccion">Reporte</div>
          </NavLink>
        )}
        <NavLink
          className="BarraLateral__link"
          activeClassName="BarraLateral__link--activo"
          to="/busqueda"
        >
          <Icon icon={search} />
          <div className="BarraLateral__nombre_seccion">Búsqueda</div>
        </NavLink>
        <NavLink
          className="BarraLateral__link"
          activeClassName="BarraLateral__link--activo"
          to="/uso"
        >
          <Icon icon={usage} />
          <div className="BarraLateral__nombre_seccion">Uso</div>
        </NavLink>
        <div className="BarraLateral__fondo">
          {!visto && (
            <div className="BarraLateral__explicacion">
              <button
                onClick={e => {
                  e.stopPropagation()
                  dispatch(marcaVisto())
                }}
                title="Cerrar"
              >
                <InlineIcon icon={iconoCerrar} />
              </button>
              <h1>Videotutoriales</h1>
              <p>Creamos videotutoriales para ayudarte a sacar el máximo de provecho a nuestro servicio</p>
            </div>
          )}
          <NavLink
            className="BarraLateral__link"
            activeClassName="BarraLateral__link--activo"
            to="/tutoriales"
          >
            <Icon icon={tutoriales} />
            <div className="BarraLateral__nombre_seccion">Tutoriales</div>
          </NavLink>
        </div>
      </div>
    </div>
  )
}

export default BarraLateral
