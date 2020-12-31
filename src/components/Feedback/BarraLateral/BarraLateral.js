import React from 'react'
import { NavLink } from 'react-router-dom'
import { Icon } from '@iconify/react'
import cloudQuestion from '@iconify/icons-mdi/frequently-asked-questions'
import search from '@iconify/icons-mdi/search'
import exportar from '@iconify/icons-mdi/file-export-outline'
import usage from '@iconify/icons-mdi/wallet'
import './BarraLateral.css'

const BarraLateral = () => {
  return (
    <div className="BarraLateral">
      <div className="BarraLateral__logo">
        
      </div>
      <NavLink
        className="BarraLateral__link"
        activeClassName="BarraLateral__link--activo"
        to="/respuestas"
      >
        <div className="BarraLateral__popup_link">Respuestas</div>
        <Icon icon={cloudQuestion} />
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
