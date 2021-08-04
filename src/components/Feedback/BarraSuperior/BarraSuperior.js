import React, { useState } from 'react'
import { Switch, Route } from 'react-router-dom'
import './BarraSuperior.css'
import MenuUsuario from './MenuUsuario'
import SelectorEncuesta from './SelectorEncuesta'
import DiagramaGuion from './DiagramaGuion'
import AlertaPilotos from './AlertaPilotos'
import Icon from '@iconify/react'
import iconoGuion from '@iconify/icons-mdi/script-text'
import { useSelector } from 'react-redux'

const BarraSuperior = () => {

  const [verModal, setVerModal] = useState(false)
  const { respuestas } = useSelector(state => state.respuestas)

  return (
    <div className="BarraSuperior">
      <DiagramaGuion visible={verModal} esconder={() => setVerModal(false)} />
      <AlertaPilotos />
      <Switch>
        <Route path="/chat/:idEncuesta/:idUsuario" component={SelectorEncuesta} />
        <Route path="/busqueda" component={SelectorEncuesta} />
        <Route path="/uso" component={SelectorEncuesta} />
        <Route path="/" component={SelectorEncuesta} />
      </Switch>
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
