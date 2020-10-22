import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Route, Switch, useHistory } from 'react-router-dom'
import { guardaRespuestas, limpiaRespuestas } from '../../redux/ducks/respuestas'
import { respuestas as respuestasAPI } from '../../api/endpoints'
import Respuestas from './Respuestas'
import './Feedback.css'
import BarraLateral from './BarraLateral'
import BarraSuperior from './BarraSuperior'
import Buscador from './Buscador'

const Feedback = () => {

  const { token } = useSelector(state => state.login)
  const { fechaInicio, fechaTermino } = useSelector(state => state.respuestas)
  const { idEncuestaSeleccionada } = useSelector(state => state.encuestas)
  const history = useHistory()
  const dispatch = useDispatch()

  useEffect(() => {
    if (token && idEncuestaSeleccionada && fechaInicio && fechaTermino) {
      const fetchData = async () => {
        dispatch(limpiaRespuestas())
        const data = await respuestasAPI(idEncuestaSeleccionada, fechaInicio, fechaTermino)
        dispatch(guardaRespuestas(data))
      }
      fetchData()
    }
  }, [token, idEncuestaSeleccionada, dispatch, fechaInicio, fechaTermino])

  if (!token) {
    history.push('/')
    return null
  }

  return (
    <div className="Feedback">
      <BarraLateral />
      <div className="Feedback__contenedor">
        <BarraSuperior />
          <div className="Feedback__contenedor_central">
          <Switch>
            <Route path="/respuestas">
              <Respuestas />
            </Route>
            <Route path="/buscar">
              <Buscador />
            </Route>
          </Switch>
        </div>
      </div>
    </div>
  )
}

export default Feedback
