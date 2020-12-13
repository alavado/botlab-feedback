import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Route, Switch } from 'react-router-dom'
import Feedback from '../Feedback'
import Login from '../Login'
import { differenceInHours } from 'date-fns'
import { cierraLaSesion } from '../../redux/ducks/login'
import './App.css'

const App = () => {

  const { token, fechaToken } = useSelector(state => state.login)
  const dispatch = useDispatch()
  
  useEffect(() => {
    if (fechaToken && differenceInHours(Date.now(), fechaToken) > 8) {
      console.log('token expirado')
      dispatch(cierraLaSesion())
    }
  }, [fechaToken, dispatch])

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
