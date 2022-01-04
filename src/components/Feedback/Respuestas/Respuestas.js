import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Chat from './Chat'
import TablaRespuestas from './TablaRespuestas'
import EnviadorRepuestas from './EnviadorRepuestas'
import TableroRespuestas from './TableroRespuestas'
import './Respuestas.css'

const Respuestas = () => {

  const { idEncuestaSeleccionada: idEncuesta } = useSelector(state => state.encuestas)

  return (
    <div className="Respuestas">
      {idEncuesta && <EnviadorRepuestas idEncuesta={idEncuesta} />}
      <Switch>
        <Route exact path="/">
          <TablaRespuestas />
        </Route>
        <Route exact path="/respuestas">
          <TablaRespuestas />
        </Route>
        <Route exact path="/tablero">
          <TableroRespuestas />
        </Route>
        <Route path="/chat/:idEncuesta/:idUsuario">
          <Chat />
        </Route>
      </Switch>
    </div>
  )
}

export default Respuestas
