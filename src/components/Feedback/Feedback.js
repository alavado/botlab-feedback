import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Route, Switch } from 'react-router-dom'
import { guardaRespuestas } from '../../redux/ducks/respuestas'
import { respuestas as respuestasAPI } from '../../api/endpoints'
import { headers as headersAPI } from '../../api/endpoints'
import Respuestas from './Respuestas'
import './Feedback.css'
import BarraLateral from './BarraLateral'
import BarraSuperior from './BarraSuperior'
import Login from '../Login'
import { guardaHeaders, limpiaEncuestas } from '../../redux/ducks/encuestas'
import ExportacionAvanzada from '../ExportacionAvanzada'
import Uso from './Uso'
import ErrorBoundary from '../../helpers/ErrorBoundary'
import { cierraLaSesion } from '../../redux/ducks/login'
import Novedades from '../Novedades'
import Tutoriales from './Tutoriales'
import Search from './Search'
import Alerts from './Alerts'
import { toggleDebugging } from '../../redux/ducks/cero'

const Feedback = () => {
  const { token } = useSelector((state) => state.login)
  const [errorCargandoRespuestas, setErrorCargandoRespuestas] = useState()
  const { fechaInicio, fechaTermino, cacheInvalido } = useSelector(
    (state) => state.respuestas
  )
  const { idEncuestaSeleccionada } = useSelector((state) => state.encuestas)
  const dispatch = useDispatch()

  useEffect(() => {
    const teclasMagicas = (e) => {
      if (e.code === 'Digit0') {
        dispatch(toggleDebugging())
      }
    }
    window.addEventListener('keyup', teclasMagicas)
    return () => window.removeEventListener('keyup', teclasMagicas)
  }, [dispatch])

  useEffect(() => {
    if (
      token &&
      idEncuestaSeleccionada &&
      fechaInicio &&
      fechaTermino &&
      cacheInvalido
    ) {
      const fetchData = async () => {
        // dispatch(limpiaRespuestas())
        try {
          const headers = await headersAPI(token)
          dispatch(guardaHeaders(headers))
          const data = await respuestasAPI(
            idEncuestaSeleccionada,
            fechaInicio,
            fechaTermino
          )
          dispatch(
            guardaRespuestas({
              jsonRespuestas: data,
              idEncuesta: idEncuestaSeleccionada,
            })
          )
        } catch (e) {
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
  }, [
    token,
    idEncuestaSeleccionada,
    dispatch,
    fechaInicio,
    fechaTermino,
    cacheInvalido,
  ])

  if (!token) {
    return <Login />
  }

  return (
    <ErrorBoundary>
      <div className="Feedback">
        {errorCargandoRespuestas}
        <Novedades />
        <Switch>
          <Route>
            <BarraLateral />
          </Route>
        </Switch>
        <div className="Feedback__contenedor">
          <Switch>
            <Route path="/interaccion">
              <></>
            </Route>
            <Route path="/busqueda">
              <></>
            </Route>
            <Route path="/alertas">
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
              <Route exact path="/alertas">
                <Alerts />
              </Route>
              <Route path="/alertas/:serviceId/:patientId">
                <Alerts />
              </Route>
              <Route exact path="/busqueda">
                <Search />
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
              <Route path="/tutoriales">
                <Tutoriales />
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
