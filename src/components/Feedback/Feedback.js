import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Route, Switch } from 'react-router-dom'
import { guardaRespuestas } from '../../redux/ducks/respuestas'
import { respuestas as respuestasAPI } from '../../api/endpoints'
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
import { cierraLaSesion } from '../../redux/ducks/login'
import Novedades from '../Novedades'
import Respuestas2 from './Respuestas2'
import Tutoriales from './Tutoriales'
import ModalConfiguracion from './ModalConfiguracion'

const Feedback = () => {

  const { token } = useSelector(state => state.login)
  const [errorCargandoRespuestas, setErrorCargandoRespuestas] = useState()
  const { fechaInicio, fechaTermino, cacheInvalido } = useSelector(state => state.respuestas)
  const { idEncuestaSeleccionada } = useSelector(state => state.encuestas)
  const dispatch = useDispatch()

  useEffect(() => {
    if (token && idEncuestaSeleccionada && fechaInicio && fechaTermino && cacheInvalido) {
      const fetchData = async () => {
        // dispatch(limpiaRespuestas())
        try {
          const headers = await headersAPI(token)
          dispatch(guardaHeaders(headers))
          const data = await respuestasAPI(idEncuestaSeleccionada, fechaInicio, fechaTermino)
          dispatch(guardaRespuestas({ jsonRespuestas: data, idEncuesta: idEncuestaSeleccionada }))
        }
        catch (e) {
          console.error(e)
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
  }, [token, idEncuestaSeleccionada, dispatch, fechaInicio, fechaTermino, cacheInvalido])

  if (!token) {
    return <Login />
  }

  return (
    <ErrorBoundary>
      <div className="Feedback">
        {errorCargandoRespuestas}
        <ModalConfiguracion />
        <Novedades />
        <Switch>
          <Route path="/respuestas2">
            <></>
          </Route>
          <Route>
            <BarraLateral />
          </Route>
        </Switch>
        <div className="Feedback__contenedor">
          <Switch>
            <Route exact path="/respuestas2">
              <></>
            </Route>
            <Route path="/interaccion">
              <></>
            </Route>
            <Route>
              <BarraSuperior />
            </Route>
          </Switch>
          <div className="Feedback__contenedor_central">
            <Switch>
              <Route exact path="/">
                <Respuestas />
              </Route>
              <Route path="/respuestas">
                <Respuestas />
              </Route>
              <Route path="/chat">
                <Respuestas />
              </Route>
              <Route path="/alertas/:id">
                <Alertas  />
              </Route>
              <Route path="/alertas">
                <Alertas  />
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
              <Route path="/respuestas2">
                <Respuestas2 />
              </Route>
              <Route path="/tablero">
                <Respuestas />
              </Route>
              <Route path="/tutoriales">
                <Tutoriales />
              </Route>
              <Route path="/interaccion">
                <Respuestas2 />
              </Route>
              <Route path="/">
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
