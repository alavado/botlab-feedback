import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Chat from './Chat'
import './Respuestas.css'
import TablaRespuestas from './TablaRespuestas/TablaRespuestas'

const Respuestas = () => {

  return (
    <div className="Respuestas">
      <Switch>
        <Route path="/respuestas">
          <TablaRespuestas />
        </Route>
        <Route path="/chat/:id">
          <Chat />
        </Route>
      </Switch>
    </div>
  )
}

export default Respuestas
