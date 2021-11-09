import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Route, Switch } from 'react-router-dom'
import Feedback from '../Feedback'
import Login from '../Login'
import { differenceInHours } from 'date-fns'
import { cierraLaSesion } from '../../redux/ducks/login'
import classNames from 'classnames'
import { ESQUEMA_OSCURO } from '../../redux/ducks/opciones'
import './App.css'
import imagenes from './preloads'

const App = () => {

  const { token, fechaToken } = useSelector(state => state.login)
  const { esquema } = useSelector(state => state.opciones)
  const dispatch = useDispatch()
  
  useEffect(() => {
    if (fechaToken && differenceInHours(Date.now(), fechaToken) > 8) {
      dispatch(cierraLaSesion())
    }
  }, [fechaToken, dispatch])

  return (
    <div className={classNames({
      'App': true,
      'App__oscura': esquema === ESQUEMA_OSCURO
    })}>
      <Switch>
        <Route exact path="/">
          {token ? <Feedback /> : <Login />}
        </Route>
        <Route path="/">
          <Feedback />
        </Route>
      </Switch>
      <div className="App__preload_imagenes">
        {imagenes.map((img, i) => <img key={`preload-img-${i}`} src={img} alt={`preload-${i}`} />)}
      </div>
    </div>
  )
}

export default App
