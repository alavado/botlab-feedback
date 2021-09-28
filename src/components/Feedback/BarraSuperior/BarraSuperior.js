import React, { useState } from 'react'
import { Switch, Route } from 'react-router-dom'
import './BarraSuperior.css'
import MenuUsuario from './MenuUsuario'
import SelectorEncuesta from './SelectorEncuesta'
import DiagramaGuion from './DiagramaGuion'
import AlertaPilotos from './AlertaPilotos'
import Icon, { InlineIcon } from '@iconify/react'
import iconoGuion from '@iconify/icons-mdi/script-text'
import { useDispatch, useSelector } from 'react-redux'
import { activaEnviador } from '../../../redux/ducks/enviador'
import iconoContacto from '@iconify/icons-mdi/send'

const BarraSuperior = () => {

  const [verModal, setVerModal] = useState(false)
  const { respuestas } = useSelector(state => state.respuestas)
  const { idEncuestaSeleccionada } = useSelector(state => state.encuestas)
  const dispatch = useDispatch()

  return (
    <div className="BarraSuperior">
      <DiagramaGuion visible={verModal} esconder={() => setVerModal(false)} />
      <AlertaPilotos />
      <Switch>
        <Route path="/chat/:idEncuesta/:idUsuario" component={SelectorEncuesta} />
        <Route path="/busqueda" component={SelectorEncuesta} />
        <Route path="/uso" component={SelectorEncuesta} />
        <Route path="/preparaciones" component={SelectorEncuesta} />
        <Route path="/" component={SelectorEncuesta} />
      </Switch>
      {respuestas && idEncuestaSeleccionada === Number(process.env.REACT_APP_ID_POLL_OREMA_OUTBOUND) && (
        <Switch>
          <Route exact path="/" component={() => (
            <button
              className="BarraSuperior__boton_enviador"
              onClick={() => dispatch(activaEnviador())}
            >
              <InlineIcon icon={iconoContacto} /> Contactar pacientes
            </button>
          )}/>
        </Switch>
      )}
      {respuestas && false && (
        <button
          onClick={() => setVerModal(!verModal)}
          className="BarraSuperior__boton"
          title={verModal ? 'Ocultar guión' : 'Ver guión' }
        >
          <Icon icon={iconoGuion} className="SelectorRangoFechas__boton_icono" />
        </button>
      )}
      <MenuUsuario />
    </div>
  )
}

export default BarraSuperior
