import React from 'react'
import { NavLink } from 'react-router-dom'
import './BarraLateral.css'

const BarraLateral = () => {
  return (
    <div className="BarraLateral">
      <NavLink to="/respuestas">
        Respuestas
      </NavLink>
      <NavLink to="/buscar">
        Buscar
      </NavLink>
    </div>
  )
}

export default BarraLateral
