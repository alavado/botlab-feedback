import React, { useState } from 'react'
import { Switch, Route } from 'react-router-dom'
import './BarraSuperior.css'
import MenuUsuario from './MenuUsuario'
import SelectorEncuesta from './SelectorEncuesta'
import inspiracion from '../../../assets/images/inspiracion-flow.jpg'

const BarraSuperior = () => {

  const [verModal, setVerModal] = useState(false)

  return (
    <div className="BarraSuperior">
      <div className="BarraSuperior__modal" style={{ display: verModal ? 'flex': 'none' }} onClick={() => setVerModal(false)}>
        <h1>Guión de esta encuesta</h1>
        <img src={inspiracion} />
      </div>
      <Switch>
        <Route path="/chat/:idEncuesta/:idUsuario" component={SelectorEncuesta} />
        <Route path="/busqueda" component={SelectorEncuesta} />
        <Route path="/uso" component={SelectorEncuesta} />
        <Route path="/" component={SelectorEncuesta} />
      </Switch>
      {/* <button onClick={() => setVerModal(true)} style={{ marginRight: 'auto', marginLeft: '.5rem' }}>Ver guión</button> */}
      <MenuUsuario />
    </div>
  )
}

export default BarraSuperior
