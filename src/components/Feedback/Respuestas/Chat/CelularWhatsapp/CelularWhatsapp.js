import React, { useMemo, useRef } from 'react'
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
import SelectorConversacion from './SelectorConversacion'

const CelularWhatsapp = ({ conversaciones, indiceConversacion, seleccionarConversacion, actualizarMensajes }) => {

  const { chatExpandido } = useSelector(state => state.opciones)
  const contenedorMensajes = useRef()
  const contenedorMensajesActuales = useRef()
  const dispatch = useDispatch()

  const todosLosMensajes = useMemo(() => {
    return conversaciones ? conversaciones.reduce((arr, c) => [...arr, ...c.messages], []) : []
  }, [conversaciones])

  return (
    <div className={classNames({
      CelularWhatsapp: true,
      'CelularWhatsapp--expandido': chatExpandido
    })}>
      <SelectorConversacion
        conversaciones={conversaciones}
        indiceConversacionSeleccionada={indiceConversacion}
        seleccionarConversacion={seleccionarConversacion}
      />
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
            mensajes={todosLosMensajes}
            actualizarMensajes={actualizarMensajes}
          />
          <div
            className="CelularWhatsapp__contenedor_mensajes"
            ref={contenedorMensajes}
          >
            <div
              className="CelularWhatsapp__contenedor_mensajes_actuales"
              ref={contenedorMensajesActuales}
            >
              {conversaciones
                ? conversaciones.map((c, ic) => {
                    const mensajes = c.messages
                    return (
                      <div
                        key={`contenedor-conversacion-${ic}`}
                        className={classNames({
                          "CelularWhatsapp__contenedor_conversacion": true,
                          "CelularWhatsapp__contenedor_conversacion--seleccionada": ic === indiceConversacion,
                        })}
                        onClick={() => seleccionarConversacion(ic)}
                      >
                        {mensajes.map((mensaje, i) => (
                          <MensajeWhatsapp
                            mensaje={mensaje}
                            mensajes={mensajes}
                            posicion={i}
                            key={`mensaje-${i}`}
                          />
                        ))}
                      </div>
                    )
                  })
                : <LoaderMensajes />
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CelularWhatsapp