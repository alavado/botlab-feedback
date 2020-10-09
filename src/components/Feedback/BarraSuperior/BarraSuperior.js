import React from 'react'
import './BarraSuperior.css'
import Logout from './Logout'
import SelectorEncuesta from './SelectorEncuesta'

const BarraSuperior = () => {
  return (
    <div className="BarraSuperior">
      <SelectorEncuesta />
      <Logout />
    </div>
  )
}

export default BarraSuperior
