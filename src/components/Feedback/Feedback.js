import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Route, Switch } from 'react-router-dom'
import { guardaRespuestas, limpiaFiltros, limpiaRespuestas } from '../../redux/ducks/respuestas'
import { alertas as alertasAPI, respuestas as respuestasAPI } from '../../api/endpoints'
import { headers as headersAPI } from '../../api/endpoints'
import Respuestas from './Respuestas'
import './Feedback.css'
import BarraLateral from './BarraLateral'
import BarraSuperior from './BarraSuperior'
import Busqueda from './Busqueda'
import Login from '../Login'
import { guardaHeaders, limpiaEncuestas } from '../../redux/ducks/encuestas'
import ExportacionAvanzada from '../ExportacionAvanzada'
import Uso from './Uso'
import ErrorBoundary from '../../helpers/ErrorBoundary'
import Alertas from './Alertas'
import { guardaAlertas } from '../../redux/ducks/alertas'
import { cierraLaSesion } from '../../redux/ducks/login'
import Preparaciones from './Preparaciones'

const intervaloRefrescoAlertas = 5_000
const alertasActivas = false

const Feedback = () => {

  const { token } = useSelector(state => state.login)
  const [errorCargandoRespuestas, setErrorCargandoRespuestas] = useState()
  const { fechaInicio, fechaTermino, cacheInvalido } = useSelector(state => state.respuestas)
  const { idEncuestaSeleccionada } = useSelector(state => state.encuestas)
  const dispatch = useDispatch()

  useEffect(() => {
    if (token && idEncuestaSeleccionada && fechaInicio && fechaTermino && cacheInvalido) {
      const fetchData = async () => {
        // dispatch(limpiaFiltros())
        dispatch(limpiaRespuestas())
        try {
          const headers = await headersAPI(token)
          dispatch(guardaHeaders(headers))
          const data = await respuestasAPI(idEncuestaSeleccionada, fechaInicio, fechaTermino)
          dispatch(guardaRespuestas(data))
        }
        catch (e) {
          dispatch(cierraLaSesion())
          dispatch(limpiaEncuestas())
        }
      }
      try {
        setErrorCargandoRespuestas(null)
        fetchData()
      } catch (e) {
        setErrorCargandoRespuestas('Ocurrió un error')
      }
    }
    if (process.env.NODE_ENV === 'development' && alertasActivas) {
      const intervalAlertas = setInterval(async () => {
        const { data } = await alertasAPI(idEncuestaSeleccionada, fechaInicio, fechaTermino)
        dispatch(guardaAlertas(data))
      }, intervaloRefrescoAlertas)
      return () => clearInterval(intervalAlertas)
    }
  }, [token, idEncuestaSeleccionada, dispatch, fechaInicio, fechaTermino, cacheInvalido])

  if (!token) {
    return <Login />
  }

  return (
    <ErrorBoundary>
      <div className="Feedback">
        {errorCargandoRespuestas}
        <BarraLateral />
        <div className="Feedback__contenedor">
          <BarraSuperior />
          <div className="Feedback__contenedor_central">
            <Switch>
              <Route exact path="/">
                <Respuestas />
              </Route>
              <Route path="/respuestas">
                <Respuestas />
              </Route>
              <Route path="/preparaciones">
                <Preparaciones />
              </Route>
              <Route path="/chat">
                <Respuestas />
              </Route>
              <Route path="/alertas">
                <Alertas />
              </Route>
              <Route exact path="/busqueda">
                <Busqueda />
              </Route>
              <Route path="/busqueda/:termino">
                <Busqueda />
              </Route>
              <Route path="/exportar">
                <ExportacionAvanzada />
              </Route>
              <Route path="/uso">
                <Uso />
              </Route>
              <Route path="/respuestas">
                <Respuestas />
              </Route>
            </Switch>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}

export default Feedback
