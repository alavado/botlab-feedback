import { useMemo, useState } from 'react'
import { Switch, Route } from 'react-router-dom'
import './BarraSuperior.css'
import MenuUsuario from './MenuUsuario'
import SelectorEncuesta from './SelectorEncuesta'
import AlertaPilotos from './AlertaPilotos'
import { InlineIcon } from '@iconify/react'
import { useDispatch, useSelector } from 'react-redux'
import { activaEnviador } from '../../../redux/ducks/enviador'
import TabsEncuestas from './TabsEncuestas'
import { obtenerPollsCalculadas } from '../../../helpers/pollsCalculadas'
import { obtenerTiposEncuestasVisibles } from '../../../helpers/encuestasSecretas'
import AlertaDeudores from './AlertaDeudores'

const BarraSuperior = () => {

  const { respuestas } = useSelector(state => state.respuestas)
  const { cuenta } = useSelector(state => state.login)
  const { idEncuestaSeleccionada, tipos } = useSelector(state => state.encuestas)
  const dispatch = useDispatch()

  const tiposOrdenados = useMemo(() => {
    const encuestaSeleccionada = tipos?.find(({ id }) => id === idEncuestaSeleccionada)
    if (!encuestaSeleccionada) {
      return tipos
    }
    const encuestasCalculadas = obtenerPollsCalculadas(encuestaSeleccionada, respuestas)
    if (encuestasCalculadas.length === 0) {
      return tipos
    }
    let tiposEncuestas = [
      encuestaSeleccionada,
      ...encuestasCalculadas,
      ...tipos.filter(({ id }) => id !== idEncuestaSeleccionada)
    ]
    return obtenerTiposEncuestasVisibles(cuenta, tiposEncuestas)
  }, [tipos, idEncuestaSeleccionada, respuestas, cuenta])

  return (
    <div className="BarraSuperior">
      <AlertaPilotos />
      <AlertaDeudores />
      {cuenta.includes('centauro') || (tiposOrdenados?.length < 5 && !cuenta.includes('redsalud'))
        ? <Switch>
            <Route path="/chat/:idEncuesta/:idUsuario" component={TabsEncuestas} />
            <Route path="/busqueda" component={TabsEncuestas} />
            <Route path="/uso" component={TabsEncuestas} />
            <Route path="/preparaciones" component={TabsEncuestas} />
            <Route path="/alertas" component={TabsEncuestas} />
            <Route path="/tutoriales" component={TabsEncuestas} />
            <Route path="/exportar" component={TabsEncuestas} />
            <Route path="/" component={TabsEncuestas} />
          </Switch>
        : <Switch>
            <Route path="/chat/:idEncuesta/:idUsuario" component={SelectorEncuesta} />
            <Route path="/busqueda" component={SelectorEncuesta} />
            <Route path="/uso" component={SelectorEncuesta} />
            <Route path="/preparaciones" component={SelectorEncuesta} />
            <Route path="/alertas" component={SelectorEncuesta} />
            <Route path="/tutoriales" component={SelectorEncuesta} />
            <Route path="/exportar" component={SelectorEncuesta} />
            <Route path="/" component={SelectorEncuesta} />
          </Switch>
      }
      {cuenta.endsWith('_cero') && (
        <Switch>
          <Route exact path="/" component={() => (
            <button
              className="BarraSuperior__boton_enviador"
              onClick={() => dispatch(activaEnviador())}
            >
              <InlineIcon icon="mdi:send" /> Contactar pacientes
            </button>
          )}/>
        </Switch>
      )}
      <MenuUsuario />
    </div>
  )
}

export default BarraSuperior
