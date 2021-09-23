import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Chat from './Chat'
import TablaRespuestas from './TablaRespuestas'
import './Respuestas.css'
import EnviadorRepuestas from './EnviadorRepuestas'

const Respuestas = () => {

  return (
    <div className="Respuestas">
      <EnviadorRepuestas />
      <Switch>
        <Route exact path="/">
          <TablaRespuestas />
        </Route>
        <Route exact path="/respuestas">
          <TablaRespuestas />
        </Route>
        <Route path="/chat/:idEncuesta/:idUsuario">
          <Chat />
        </Route>
      </Switch>
    </div>
  )
}

export default Respuestas
