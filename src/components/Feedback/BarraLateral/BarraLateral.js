import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Icon } from '@iconify/react'
import search from '@iconify/icons-mdi/search'
import alertas from '@iconify/icons-mdi/bell'
import exportar from '@iconify/icons-mdi/file-export-outline'
import usage from '@iconify/icons-mdi/wallet'
import home from '@iconify/icons-mdi/home'
import logo from '../../../assets/images/logo-cero.svg'
import './BarraLateral.css'

const BarraLateral = () => {
  return (
    <div className="BarraLateral">
      <Link
        to="/respuestas"
        className="BarraLateral__link_logo"
      >
        <div className="BarraLateral__logo">
          <img className="BarraLateral__logo_imagen" src={logo} alt="Logo Cero.ai" />
        </div>
      </Link>
      <NavLink
        className="BarraLateral__link"
        activeClassName="BarraLateral__link--activo"
        to="/respuestas"
      >
        <div className="BarraLateral__popup_link">Respuestas</div>
        <Icon icon={home} />
      </NavLink>
      <NavLink
        className="BarraLateral__link"
        activeClassName="BarraLateral__link--activo"
        to="/alertas"
      >
        <div className="BarraLateral__popup_link">Alertas</div>
        <Icon icon={alertas} />
      </NavLink>
      <NavLink
        className="BarraLateral__link"
        activeClassName="BarraLateral__link--activo"
        to="/exportar"
      >
        <div className="BarraLateral__popup_link">Exportar</div>
        <Icon icon={exportar} />
      </NavLink>
      <NavLink
        className="BarraLateral__link"
        activeClassName="BarraLateral__link--activo"
        to="/busqueda"
      >
        <div className="BarraLateral__popup_link">Búsqueda</div>
        <Icon icon={search} />
      </NavLink>
      <NavLink
        className="BarraLateral__link"
        activeClassName="BarraLateral__link--activo"
        to="/uso"
      >
        <div className="BarraLateral__popup_link">Uso</div>
        <Icon icon={usage} />
      </NavLink>
    </div>
  )
}

export default BarraLateral
