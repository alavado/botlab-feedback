import React from 'react'
import { useSelector } from 'react-redux'
import { Route, Switch } from 'react-router-dom'
import Feedback from '../Feedback'
import Login from '../Login'
import './App.css'

const App = () => {

  const { token } = useSelector(state => state.login)

  return (
    <div className="App">
      <Switch>
        <Route exact path="/">
          {token ? <Feedback /> : <Login />}
        </Route>
        <Route path="/">
          <Feedback />
        </Route>
      </Switch>
    </div>
  )
}

export default App
