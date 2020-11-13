import React from 'react'
import { NavLink } from 'react-router-dom'
import { Icon } from '@iconify/react'
import cloudQuestion from '@iconify/icons-mdi/frequently-asked-questions'
import search from '@iconify/icons-mdi/search'
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
        <Icon icon={cloudQuestion} />
      </NavLink>
      <NavLink
        className="BarraLateral__link"
        activeClassName="BarraLateral__link--activo"
        to="/busqueda"
      >
        <Icon icon={search} />
      </NavLink>
    </div>
  )
}

export default BarraLateral
