import React, { useMemo, useRef, useEffect } from 'react'
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
import { useHistory } from 'react-router'
import { toggleDebugging } from '../../../../../redux/ducks/cero'

const CelularWhatsapp = ({ conversaciones, indiceConversacion, seleccionarConversacion, actualizarMensajes }) => {

  const { chatExpandido } = useSelector(state => state.opciones)
  const contenedorMensajes = useRef()
  const dispatch = useDispatch()
  const history = useHistory()

  const todosLosMensajes = useMemo(() => {
    return conversaciones ? conversaciones.reduce((arr, c) => [...arr, ...c.messages], []) : []
  }, [conversaciones])

  const irAConversacion = indice => {
    seleccionarConversacion(indice)
    const conversacion = document.getElementById(`contenedor-conversacion-${indice}`)
    conversacion.scrollIntoView()
  }

  useEffect(() => {
    if (conversaciones?.length > 0) {
      const conversacion = document.getElementById(`contenedor-conversacion-${conversaciones.length - 1}`)
      conversacion.scrollIntoView()
      contenedorMensajes.current.focus({ preventScroll: true })
    }
  }, [conversaciones])

  useEffect(() => {
    const teclasMagicas = e => {
      if (e.code === 'Digit0') {
        dispatch(toggleDebugging())
      }
    }
    window.addEventListener('keyup', teclasMagicas)
    return () => window.removeEventListener('keyup', teclasMagicas)
  }, [])

  return (
    <div className={classNames({
      CelularWhatsapp: true,
      'CelularWhatsapp--expandido': chatExpandido
    })}>
      <SelectorConversacion
        conversaciones={conversaciones}
        indiceConversacionSeleccionada={indiceConversacion}
        seleccionarConversacion={irAConversacion}
      />
      <div className="CelularWhatsapp__celular">
        <div className="CelularWhatsapp__datos_extra">
          {history.location.pathname.slice(6)}
        </div>
        {/* <div style={{
          position: 'absolute',
          height: '75vh',
          width: '.5rem',
          display: 'flex',
          flexDirection: 'column',
          right: 0,
          top: '5vh'
        }}>
          {bin.split('').map((v, i) => <div key={`pieza{${i}}`} style={{ flex: 1, background: v === '0' ? 'black' : 'transparent' }} />)}
        </div> */}
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
            tabIndex={0}
          >
            {conversaciones
              ? conversaciones.map((c, ic) => {
                  const mensajes = c.messages
                  return (
                    <div
                      key={`contenedor-conversacion-${ic}`}
                      id={`contenedor-conversacion-${ic}`}
                      className={classNames({
                        "CelularWhatsapp__contenedor_conversacion": true,
                        "CelularWhatsapp__contenedor_conversacion--seleccionada": ic === indiceConversacion,
                      })}
                      title={ic === indiceConversacion ? '' : 'Ver conversación'}
                      onClick={() => seleccionarConversacion(ic)}
                    >
                      {mensajes.length > 0
                        ? mensajes.map((mensaje, i) => (
                          <MensajeWhatsapp
                            mensaje={mensaje}
                            mensajes={mensajes}
                            posicion={i}
                            key={`mensaje-${i}`}
                          />
                          ))
                        : <p className="CelularWhatsapp__conversacion_vacia">
                            Esta conversación todavía no contiene mensajes
                          </p>
                      }
                    </div>
                  )
                })
              : <LoaderMensajes />
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default CelularWhatsapp