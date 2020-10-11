import React from 'react'
import './BarraSuperior.css'
import MenuUsuario from './MenuUsuario'
import SelectorEncuesta from './SelectorEncuesta'

const BarraSuperior = () => {
  return (
    <div className="BarraSuperior">
      <SelectorEncuesta />
      <MenuUsuario />
    </div>
  )
}

export default BarraSuperior
