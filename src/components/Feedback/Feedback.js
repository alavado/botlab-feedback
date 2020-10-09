import React from 'react'
import { useSelector } from 'react-redux'
import { Route, Switch, useHistory } from 'react-router-dom'
import Respuestas from '../Respuestas/Respuestas'
import './Feedback.css'

const Feedback = () => {

  const { token } = useSelector(state => state.login)
  const history = useHistory()

  if (!token) {
    history.push('/')
    return null
  }

  return (
    <div className="Feedback">
      <Switch>
        <Route path="/respuestas">
          <Respuestas />
        </Route>
      </Switch>
    </div>
  )
}

export default Feedback
