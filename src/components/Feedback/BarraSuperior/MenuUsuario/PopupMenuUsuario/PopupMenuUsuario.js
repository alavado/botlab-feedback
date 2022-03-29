import React, { useCallback, useEffect } from 'react'
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
import iconoNovedades from '@iconify/icons-mdi/robot-happy-outline'
import iconoTablero from '@iconify/icons-mdi/developer-board'
import iconoReducirZoom from '@iconify/icons-mdi/minus'
import iconoAumentarZoom from '@iconify/icons-mdi/plus'
import { InlineIcon } from '@iconify/react'
import { limpiaFiltros } from '../../../../../redux/ducks/respuestas'
import { useHistory } from 'react-router-dom'
import { createPortal } from 'react-dom'

const PopupMenuUsuario = ({ visible, esconder }) => {

  const { cuenta } = useSelector(state => state.login)
  const { esquema } = useSelector(state => state.opciones)
  const { scrambled } = useSelector(state => state.scrambler)
  const history = useHistory()
  const dispatch = useDispatch()

  const esc = useCallback(e => e.key === 'Escape' && esconder(), [esconder])

  useEffect(() => {
    if (visible) {
      window.addEventListener('keyup', esc)
    }
    else {
      window.removeEventListener('keyup', esc)
    }
  }, [esc, visible])

  const zoomIn = () => {
    const html = document.querySelector('html')
    const tamañoAnterior = window.getComputedStyle(html, null).getPropertyValue('font-size').slice(0, -2)
    html.style.fontSize = `${Number(tamañoAnterior) + 2}px`
  }

  const zoomOut = () => {
    const html = document.querySelector('html')
    const tamañoAnterior = window.getComputedStyle(html, null).getPropertyValue('font-size').slice(0, -2)
    html.style.fontSize = `${Number(tamañoAnterior) - 2}px`
  }

  return createPortal(
    <div
      className="PopupMenuUsuario__lamina"
      onClick={esconder}
      style={{ pointerEvents: visible ? 'all' : 'none' }}
    >
      <div
        onClick={e => e.stopPropagation()}
        className={classNames({
          'PopupMenuUsuario': true,
          'PopupMenuUsuario--visible': visible
        })}
      >
        <div className="PopupMenuUsuario__controles_zoom">
          Ajustar zoom
          <button
            className="PopupMenuUsuario__boton_zoom"
            onClick={zoomOut}
          >
            <InlineIcon icon={iconoReducirZoom} />
          </button>
          <button
            className="PopupMenuUsuario__boton_zoom"
            onClick={zoomIn}
          >
          <InlineIcon icon={iconoAumentarZoom} />
          </button>
        </div>
        <div className="PopupMenuUsuario__opciones">
          <button
            className="PopupMenuUsuario__boton_opcion"
            onClick={e => {
              e.stopPropagation()
            }}
          >
            <InlineIcon className="PopupMenuUsuario__icono_opcion" icon={iconoNovedades} /> Novedades del servicio
          </button>
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
          <div className="PopupMenuUsuario__separador" />
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
    </div>
  , document.getElementById('popup-menu-usuario'))
}

export default PopupMenuUsuario
