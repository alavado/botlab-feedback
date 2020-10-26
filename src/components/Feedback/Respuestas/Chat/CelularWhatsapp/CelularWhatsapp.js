import React from 'react'
import LoaderMensajes from './LoaderMensajes'
import BarraAppCelular from './BarraAppCelular'
import BarraEstadoCelular from './BarraEstadoCelular'
import MensajeWhatsapp from './MensajeWhatsapp'
import './CelularWhatsapp.css'

export const CelularWhatsapp = ({ mensajes }) => {

  return (
    <div className="CelularWhatsapp">
      <div className="CelularWhatsapp__celular">
        <div className="CelularWhatsapp__pantalla">
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
