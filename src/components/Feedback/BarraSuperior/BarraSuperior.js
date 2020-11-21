import React from 'react'
import { Switch, Route } from 'react-router-dom'
import './BarraSuperior.css'
import MenuUsuario from './MenuUsuario'
import SelectorEncuesta from './SelectorEncuesta'

const BarraSuperior = () => {
  return (
    <div className="BarraSuperior">
      <Switch>
        <Route path="/chat/:idEncuesta/:idUsuario" component={SelectorEncuesta} />
        <Route path="/busqueda" component={SelectorEncuesta} />
        <Route path="/" component={SelectorEncuesta} />
      </Switch>
      <MenuUsuario />
    </div>
  )
}

export default BarraSuperior
