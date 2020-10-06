import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Login from '../Login'
import Respuestas from '../Respuestas'
import './App.css'

const App = () => {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/" component={Login} />
        <Route path="/respuestas" component={Respuestas} />
      </Switch>
    </div>
  )
}

export default App
