import React, { useState } from 'react'
import { Switch, Route } from 'react-router-dom'
import './BarraSuperior.css'
import MenuUsuario from './MenuUsuario'
import SelectorEncuesta from './SelectorEncuesta'
import DiagramaGuion from './DiagramaGuion'
import AlertaPilotos from './AlertaPilotos'

const BarraSuperior = () => {

  const [verModal, setVerModal] = useState(false)

  return (
    <div className="BarraSuperior">
      <DiagramaGuion visible={verModal} esconder={() => setVerModal(false)} />
      <AlertaPilotos />
      <Switch>
        <Route path="/chat/:idEncuesta/:idUsuario" component={SelectorEncuesta} />
        <Route path="/busqueda" component={SelectorEncuesta} />
        <Route path="/uso" component={SelectorEncuesta} />
        <Route path="/" component={SelectorEncuesta} />
      </Switch>
      <button
        onClick={() => setVerModal(!verModal)}
        style={{ marginRight: 'auto', marginLeft: '.5rem' }}
        title="Ver guión de esta encuesta"
      >
        Ver guión
      </button>
      <MenuUsuario />
    </div>
  )
}

export default BarraSuperior
