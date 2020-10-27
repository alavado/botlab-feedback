import React from 'react'
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

export const CelularWhatsapp = ({ mensajes }) => {

  const { chatExpandido } = useSelector(state => state.opciones)
  const dispatch = useDispatch()

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
          <BarraAppCelular />
          <div className="CelularWhatsapp__contenedor_mensajes">
            {Array.isArray(mensajes)
              ? mensajes.map((mensaje, i) => (
                  <MensajeWhatsapp
                    mensaje={mensaje}
                    mensajes={mensajes}
                    posicion={i}
                    key={`mensaje-${i}`}
                  />
                ))
              : <LoaderMensajes />
            }
          </div>
        </div>
      </div>
    </div>
  )
}
