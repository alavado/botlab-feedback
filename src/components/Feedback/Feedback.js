import React from 'react'
import { useSelector } from 'react-redux'
import { Route, Switch, useHistory } from 'react-router-dom'
import Respuestas from './Respuestas'
import './Feedback.css'
import BarraLateral from './BarraLateral'
import BarraSuperior from './BarraSuperior'
import Buscador from './Buscador'

const Feedback = () => {

  const { token } = useSelector(state => state.login)
  const history = useHistory()

  if (!token) {
    history.push('/')
    return null
  }

  return (
    <div className="Feedback">
      <BarraLateral />
      <div className="Feedback__contenedor">
        <BarraSuperior />
          <div className="Feedback__contenedor_central">
          <Switch>
            <Route path="/respuestas">
              <Respuestas />
            </Route>
            <Route path="/buscar">
              <Buscador />
            </Route>
          </Switch>
        </div>
      </div>
    </div>
  )
}

export default Feedback
