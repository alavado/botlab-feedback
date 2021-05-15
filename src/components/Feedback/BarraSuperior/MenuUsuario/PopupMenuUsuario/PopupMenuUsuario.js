import React from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import './PopupMenuUsuario.css'
import { useDispatch, useSelector } from 'react-redux'
import { cierraLaSesion } from '../../../../../redux/ducks/login'
import { limpiaEncuestas } from '../../../../../redux/ducks/encuestas'
import { cambiaEsquemaColor, ESQUEMA_OSCURO } from '../../../../../redux/ducks/opciones'
import { escondeDatosSensibles } from '../../../../../redux/ducks/scrambler'
import iconoCerrarSesion from '@iconify/icons-mdi/exit-to-app'
import iconoLuna from '@iconify/icons-mdi/weather-night'
import iconoSol from '@iconify/icons-mdi/white-balance-sunny'
import { InlineIcon } from '@iconify/react'
import Scrambler from '../../../../../helpers/Scrambler/Scrambler'

const PopupMenuUsuario = ({ visible, esconder }) => {

  const { nombreUsuario } = useSelector(state => state.login)
  const { esquema } = useSelector(state => state.opciones)
  const { scrambled } = useSelector(state => state.scrambler)
  const dispatch = useDispatch()

  return <>
      <div
        onClick={e => e.stopPropagation()}
        className={classNames({
          'PopupMenuUsuario': true,
          'PopupMenuUsuario--visible': visible
        })}
      >
        <div className="PopupMenuUsuario__superior">
          <Scrambler tipo="usuario">{nombreUsuario}</Scrambler>
        </div>
        <div className="PopupMenuUsuario__opciones">
          <button
            className="PopupMenuUsuario__boton_opcion"
            onClick={e => {
              e.stopPropagation()
              dispatch(cambiaEsquemaColor())
            }}
          >
            <InlineIcon className="PopupMenuUsuario__icono_opcion" icon={esquema === ESQUEMA_OSCURO ? iconoSol : iconoLuna}></InlineIcon> Ver colores {esquema === ESQUEMA_OSCURO ? 'diurnos' : 'nocturnos'}
          </button>
          <button
            className="PopupMenuUsuario__boton_opcion"
            onClick={e => {
              e.stopPropagation()
              dispatch(escondeDatosSensibles(!scrambled))
            }}
          >
            <InlineIcon className="PopupMenuUsuario__icono_opcion" icon={esquema === ESQUEMA_OSCURO ? iconoSol : iconoLuna}></InlineIcon> {scrambled ? 'Mostrar datos sensibles' : 'Esconder datos sensibles'}
          </button>
          <button
            className="PopupMenuUsuario__boton_opcion"
            onClick={() => {
              dispatch(cierraLaSesion())
              dispatch(limpiaEncuestas())
              window.location.reload()
            }}
          >
            <InlineIcon className="PopupMenuUsuario__icono_opcion" icon={iconoCerrarSesion}></InlineIcon> Cerrar sesión
          </button>
        </div>
      </div>
      {ReactDOM.createPortal(
        <div
          className="PopupMenuUsuario__lamina"
          onClick={esconder}
          style={{ pointerEvents: visible ? 'all' : 'none' }}
        >
        </div>,
        document.getElementById('popup-menu-usuario')
      )}
    </>
}

export default PopupMenuUsuario
