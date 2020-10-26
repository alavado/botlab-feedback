import React from 'react'
import { format, parseISO } from 'date-fns'
import { InlineIcon } from '@iconify/react'
import iconoVisto from '@iconify/icons-mdi/check-all'
import iconoArchivo from '@iconify/icons-mdi/file-pdf-outline'
import LoaderMensajes from './LoaderMensajes'
import classNames from 'classnames'
import { es } from 'date-fns/locale'
import BarraAppCelular from './BarraAppCelular'
import BarraEstadoCelular from './BarraEstadoCelular'
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
                  <div
                    className="CelularWhatsapp__contenedor_mensaje_y_fecha"
                    key={mensaje.epoch}
                  >
                    {(i === 0 || format(parseISO(mensaje.timestamp), 'd') !== format(parseISO(mensajes[i - 1].timestamp), 'd')) &&
                      <div className="CelularWhatsapp__fecha_mensaje">
                        {format(parseISO(mensaje.timestamp), 'd \'de\' MMMM \'de\' yyyy', { locale: es })}
                      </div>
                    }
                    <div
                      className={classNames({
                        'CelularWhatsapp__mensaje': true,
                        'CelularWhatsapp__mensaje--entrante': mensaje.type === 'bot',
                        'CelularWhatsapp__mensaje--saliente': mensaje.type !== 'bot'
                      })}
                      style={{ animationDelay: `${i * .15}s` }}
                    >
                      <div className="CelularWhatsapp__texto">
                        {mensaje.message.indexOf('ATTACHMENT') > 0
                          ? <>
                              <InlineIcon className="CelularWhatsapp__pdf" icon={iconoArchivo} />
                              {mensaje.message.slice(0, mensaje.message.indexOf('ATTACHMENT'))}
                            </>
                          : mensaje.message
                        }
                        <div className="CelularWhatsapp__hora">
                          {format(parseISO(mensaje.timestamp), 'HH:mm')}
                          {mensaje.type !== 'bot' && <InlineIcon className="CelularWhatsapp__icono_visto" icon={iconoVisto} />}
                        </div>
                      </div>
                      <div className="CelularWhatsapp__hora_visible">
                        {format(parseISO(mensaje.timestamp), 'HH:mm')}
                        {mensaje.type !== 'bot' && <InlineIcon className="CelularWhatsapp__icono_visto" icon={iconoVisto} />}
                      </div>
                    </div>
                  </div>
                ))
              : <LoaderMensajes />
            }
          </div>
        </div>
      </div>
    </div>
  )
}
