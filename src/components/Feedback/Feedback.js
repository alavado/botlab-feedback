import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Route, Switch } from 'react-router-dom'
import { guardaRespuestas, limpiaRespuestas } from '../../redux/ducks/respuestas'
import { respuestas as respuestasAPI } from '../../api/endpoints'
import { headers as headersAPI } from '../../api/endpoints'
import Respuestas from './Respuestas'
import './Feedback.css'
import BarraLateral from './BarraLateral'
import BarraSuperior from './BarraSuperior'
import Busqueda from './Busqueda'
import Login from '../Login'
import { guardaHeaders } from '../../redux/ducks/encuestas'

const Feedback = () => {

  const { token } = useSelector(state => state.login)
  const [errorCargandoRespuestas, setErrorCargandoRespuestas] = useState()
  const { fechaInicio, fechaTermino } = useSelector(state => state.respuestas)
  const { idEncuestaSeleccionada } = useSelector(state => state.encuestas)
  const dispatch = useDispatch()

  useEffect(() => {
    if (token && idEncuestaSeleccionada && fechaInicio && fechaTermino) {
      const fetchData = async () => {
        dispatch(limpiaRespuestas())
        const headers = await headersAPI()
        dispatch(guardaHeaders(headers))
        const data = await respuestasAPI(idEncuestaSeleccionada, fechaInicio, fechaTermino)
        dispatch(guardaRespuestas(data))
      }
      try {
        setErrorCargandoRespuestas(null)
        fetchData()
      } catch (e) {
        setErrorCargandoRespuestas('Ocurrió un error')
      }
    }
  }, [token, idEncuestaSeleccionada, dispatch, fechaInicio, fechaTermino])

  if (!token) {
    return <Login />
  }

  return (
    <div className="Feedback">
      {errorCargandoRespuestas}
      <BarraLateral />
      <div className="Feedback__contenedor">
        <BarraSuperior />
        <div className="Feedback__contenedor_central">
          <Switch>
            <Route path="/respuestas">
              <Respuestas />
            </Route>
            <Route path="/chat">
              <Respuestas />
            </Route>
            <Route exact path="/busqueda">
              <Busqueda />
            </Route>
            <Route path="/busqueda/:termino">
              <Busqueda />
            </Route>
          </Switch>
        </div>
      </div>
    </div>
  )
}

export default Feedback
