import React from 'react'
import { NavLink } from 'react-router-dom'
import { Icon } from '@iconify/react'
import formatListCheckbox from '@iconify/icons-mdi/format-list-checkbox'
import search from '@iconify/icons-mdi/search'
import './BarraLateral.css'

const BarraLateral = () => {
  return (
    <div className="BarraLateral">
      <div className="BarraLateral__logo">
        b
      </div>
      <NavLink
        className="BarraLateral__link"
        activeClassName="BarraLateral__link--activo"
        to="/respuestas"
      >
        <Icon icon={formatListCheckbox} />
      </NavLink>
      <NavLink
        className="BarraLateral__link"
        activeClassName="BarraLateral__link--activo"
        to="/buscar"
      >
        <Icon icon={search} />
      </NavLink>
    </div>
  )
}

export default BarraLateral
