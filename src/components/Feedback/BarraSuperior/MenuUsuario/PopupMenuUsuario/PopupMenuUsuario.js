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
import iconoIncognito from '@iconify/icons-mdi/incognito'
import iconoTablero from '@iconify/icons-mdi/developer-board'
import iconoUsuario from '@iconify/icons-mdi/account-circle'
import iconoScrambled from '@iconify/icons-mdi/incognito'
import { InlineIcon } from '@iconify/react'
import Scrambler from '../../../../Scrambler/Scrambler'
import { limpiaFiltros } from '../../../../../redux/ducks/respuestas'
import { useHistory } from 'react-router-dom'

const PopupMenuUsuario = ({ visible, esconder }) => {

  const { nombreUsuario, cuenta } = useSelector(state => state.login)
  const { esquema } = useSelector(state => state.opciones)
  const { scrambled } = useSelector(state => state.scrambler)
  const history = useHistory()
  const dispatch = useDispatch()

  return <>
      <div
        onClick={e => e.stopPropagation()}
        className={classNames({
          'PopupMenuUsuario': true,
          'PopupMenuUsuario--visible': visible
        })}
      >
        {/* <div className="PopupMenuUsuario__superior">
          <InlineIcon icon={scrambled ? iconoScrambled : iconoUsuario} />
          <span className="PopupMenuUsuario__nombre_usuario">
            <Scrambler tipo="usuario">{nombreUsuario}</Scrambler>
          </span>
        </div> */}
        <div className="PopupMenuUsuario__opciones">
          {(cuenta.endsWith('cero') || cuenta.endsWith('botlab')) &&
            <button
              className="PopupMenuUsuario__boton_opcion"
              onClick={e => {
                e.stopPropagation()
                history.push('/tablero')
              }}
            >
              <InlineIcon className="PopupMenuUsuario__icono_opcion" icon={iconoTablero} /> Tablero de respuestas
            </button>
          }
          <button
            className="PopupMenuUsuario__boton_opcion"
            onClick={e => {
              e.stopPropagation()
              dispatch(cambiaEsquemaColor())
            }}
          >
            <InlineIcon className="PopupMenuUsuario__icono_opcion" icon={esquema === ESQUEMA_OSCURO ? iconoSol : iconoLuna} /> Ver colores {esquema === ESQUEMA_OSCURO ? 'diurnos' : 'nocturnos'}
          </button>
          <button
            className="PopupMenuUsuario__boton_opcion"
            onClick={e => {
              e.stopPropagation()
              dispatch(escondeDatosSensibles(!scrambled))
            }}
          >
            <InlineIcon className="PopupMenuUsuario__icono_opcion" icon={iconoIncognito} /> {scrambled ? 'Mostrar' : 'Ocultar'} datos sensibles
          </button>
          <button
            className="PopupMenuUsuario__boton_opcion"
            onClick={() => {
              dispatch(limpiaEncuestas())
              dispatch(limpiaFiltros())
              dispatch(cierraLaSesion())
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
