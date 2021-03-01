import React from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import './PopupMenuUsuario.css'
import { useDispatch, useSelector } from 'react-redux'
import { cierraLaSesion } from '../../../../../redux/ducks/login'
import { limpiaEncuestas } from '../../../../../redux/ducks/encuestas'
import { cambiaEsquemaColor } from '../../../../../redux/ducks/opciones'

const PopupMenuUsuario = ({ visible, esconder }) => {

  const { nombreUsuario } = useSelector(state => state.login)
  const dispatch = useDispatch()

  return ReactDOM.createPortal(
    <div
      className="PopupMenuUsuario__lamina"
      onClick={esconder}
      style={{ pointerEvents: visible ? 'all' : 'none' }}
    >
      <div className={classNames({
        'PopupMenuUsuario': true,
        'PopupMenuUsuario--visible': visible
      })}>
        <div className="PopupMenuUsuario__superior">
          {nombreUsuario}
        </div>
        <div className="PopupMenuUsuario__opciones">
          <button
            className="PopupMenuUsuario__boton_opcion"
            onClick={e => {
              e.stopPropagation()
              dispatch(cambiaEsquemaColor())
            }}
          >
            Cambia esquema
          </button>
          <button
            className="PopupMenuUsuario__boton_opcion"
            onClick={() => {
              dispatch(cierraLaSesion())
              dispatch(limpiaEncuestas())
              window.location.reload()
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>,
    document.getElementById('popup_menu_usuario')
  )
}

export default PopupMenuUsuario
