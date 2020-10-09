import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Feedback from '../Feedback'
import Login from '../Login'
import './App.css'

const App = () => {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/">
          <Login />
        </Route>
        <Route path="/">
          <Feedback />
        </Route>
      </Switch>
    </div>
  )
}

export default App
