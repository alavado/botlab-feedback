import React from 'react'
import classNames from 'classnames'
import './CelularWhatsapp.css'
import { useSelector } from 'react-redux'

export const CelularWhatsapp = ({ mensajes }) => {

  const { nombreUsuario } = useSelector(state => state.login)

  return (
    <div className="CelularWhatsapp">
      <div className="CelularWhatsapp__celular">
        <div className="CelularWhatsapp__pantalla">
          <div className="CelularWhatsapp__barra_estado">
            19:11
          </div>
          <div className="CelularWhatsapp__barra_app">
            Gaby de {nombreUsuario}
          </div>
          <div className="CelularWhatsapp__contenedor_mensajes">
            {mensajes.map(mensaje => (
              <div
                className={classNames({
                  'CelularWhatsapp__mensaje': true,
                  'CelularWhatsapp__mensaje--entrante': mensaje.type === 'bot',
                  'CelularWhatsapp__mensaje--saliente': mensaje.type !== 'bot'
                })}
                key={mensaje.epoch}
              >
                <div className="CelularWhatsapp__texto">
                  {mensaje.message}
                </div>
                <div className="CelularWhatsapp__hora">
                  {mensaje.timestamp}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
