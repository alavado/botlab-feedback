import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Icon } from '@iconify/react'
import search from '@iconify/icons-mdi/search'
import alertas from '@iconify/icons-mdi/robot'
import iconoSinAlertas from '@iconify/icons-mdi/robot-happy'
import exportar from '@iconify/icons-mdi/table-export'
import usage from '@iconify/icons-mdi/wallet'
import home from '@iconify/icons-mdi/home'
// import preparaciones from '@iconify/icons-mdi/clipboard-check'
import logo from '../../../assets/images/logo-cero.svg'
import './BarraLateral.css'
import { useSelector } from 'react-redux'
import ConteoAlertas from './ConteoAlertas'
import { tieneAccesoAReportes } from '../../../helpers/permisos'

const usuariosConAlertas = [
  'Aquamed',
  'MAZ',
  'Bioreuma',
  'OYEDental',
  'Avaria',
  'YohananTherapeutes',
  'Maitenes'
]

const BarraLateral = () => {

  const { cuenta, nombreUsuario } = useSelector(state => state.login)
  const [feliz, setFeliz] = useState(false)
  
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
        {(cuenta.endsWith('_cero') || cuenta.endsWith('_botlab') || usuariosConAlertas.includes(nombreUsuario)) &&
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
      </div>
    </div>
  )
}

export default BarraLateral
