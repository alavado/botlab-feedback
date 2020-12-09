import React, { useMemo, useEffect, useRef } from 'react'
import LoaderMensajes from './LoaderMensajes'
import BarraAppCelular from './BarraAppCelular'
import BarraEstadoCelular from './BarraEstadoCelular'
import MensajeWhatsapp from './MensajeWhatsapp'
import { useDispatch, useSelector } from 'react-redux'
import classNames from 'classnames'
import './CelularWhatsapp.css'
import { fijaChatExpandido } from '../../../../../redux/ducks/opciones'
import Icon from '@iconify/react'
import iconoEncoger from '@iconify/icons-mdi/arrow-collapse'

const CelularWhatsapp = ({ mensajes, actualizarMensajes }) => {

  const { chatExpandido } = useSelector(state => state.opciones)
  const contenedorMensajes = useRef()
  const contenedorMensajesActuales = useRef()
  const dispatch = useDispatch()
  const todosLosMensajes = useMemo(() => {
    return mensajes ? [...mensajes.anteriores, ...mensajes.actuales] : []
  }, [mensajes])

  useEffect(() => {
    if (mensajes?.anteriores.length > 0) {
      const contenedor = document.getElementsByClassName('CelularWhatsapp__contenedor_mensajes')[0]
      const contenedorActuales = document.getElementsByClassName('CelularWhatsapp__contenedor_mensajes_actuales')[0]
      contenedor.scrollTop = contenedorActuales.getBoundingClientRect().top - contenedor.getBoundingClientRect().top
    }
  }, [mensajes])

  return (
    <div className={classNames({
      CelularWhatsapp: true,
      'CelularWhatsapp--expandido': chatExpandido
    })}>
      <div className="CelularWhatsapp__celular">
        <div className="CelularWhatsapp__pantalla">
          <button
            className={classNames({
              CelularWhatsapp__boton_encoger: true,
              'CelularWhatsapp__boton_encoger--visible': chatExpandido
            })}
            title="Vista compacta"
            onClick={() => dispatch(fijaChatExpandido(false))}
          >
            <Icon icon={iconoEncoger} />
          </button>
          <BarraEstadoCelular />
          <BarraAppCelular
            mensajes={mensajes}
            actualizarMensajes={actualizarMensajes}
          />
          <div
            className="CelularWhatsapp__contenedor_mensajes"
            ref={contenedorMensajes}
          >
            <div className="CelularWhatsapp__contenedor_mensajes_anteriores">
              {Array.isArray(mensajes?.anteriores)
                ? mensajes.anteriores.map((mensaje, i) => (
                    <MensajeWhatsapp
                      mensaje={mensaje}
                      mensajes={todosLosMensajes}
                      posicion={i}
                      key={`mensaje-${i}`}
                    />
                  ))
                : <LoaderMensajes />
              }
            </div>
            <div
              className="CelularWhatsapp__contenedor_mensajes_actuales"
              ref={contenedorMensajesActuales}
            >
              {Array.isArray(mensajes?.actuales)
                ? mensajes.actuales.map((mensaje, i) => (
                    <MensajeWhatsapp
                      mensaje={mensaje}
                      mensajes={todosLosMensajes}
                      posicion={i + mensajes.anteriores.length}
                      key={`mensaje-${i}`}
                    />
                  ))
                : null
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CelularWhatsapp