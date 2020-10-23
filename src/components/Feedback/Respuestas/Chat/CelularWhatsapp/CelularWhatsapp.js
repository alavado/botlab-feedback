import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { format, parseISO } from 'date-fns'
import { Icon, InlineIcon } from '@iconify/react'
import phone from '@iconify/icons-mdi/phone'
import iconoVisto from '@iconify/icons-mdi/check-all'
import iconoVolver from '@iconify/icons-mdi/arrow-back'
import iconoBateria from '@iconify/icons-mdi/battery'
import iconoSeñal from '@iconify/icons-mdi/signal'
import LoaderMensajes from './LoaderMensajes'
import classNames from 'classnames'
import { es } from 'date-fns/locale'
import './CelularWhatsapp.css'

export const CelularWhatsapp = ({ mensajes }) => {

  const { nombreUsuario } = useSelector(state => state.login)
  const [hora, setHora] = useState(new Date())

  useEffect(() => {
    const actualizarHora = setInterval(() => setHora(new Date()), 1000)
    return () => clearInterval(actualizarHora)
  }, [])

  return (
    <div className="CelularWhatsapp">
      <div className="CelularWhatsapp__celular">
        <div className="CelularWhatsapp__pantalla">
          <div className="CelularWhatsapp__barra_estado">
            <InlineIcon icon={iconoSeñal} className="CelularWhatsapp__icono_barra_estado" />
            100%
            <InlineIcon icon={iconoBateria} className="CelularWhatsapp__icono_barra_estado" />
            {format(hora, 'HH:mm')}
          </div>
          <div className="CelularWhatsapp__barra_app">
            <div className="CelularWhatsapp__barra_app_izquierda">
              <Icon icon={iconoVolver} className="CelularWhatsapp__icono_volver" />
              <div className="CelularWhatsapp___barra_app_avatar" />
              <div className="CelularWhatsapp__barra_app_contenedor_nombre">
                <div className="CelularWhatsapp__barra_app_nombre">
                  Gaby de {nombreUsuario.split(' ')[0]}
                </div>
                <div className="CelularWhatsapp__barra_app_estado">
                  en línea
                </div>
              </div>
            </div>
            <div className="CelularWhatsapp__barra_app_iconos">
              <Icon icon={phone} />
            </div>
          </div>
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
                        {mensaje.message}
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
