import React, { useState, useEffect } from 'react'
import classNames from 'classnames'
import './CelularWhatsapp.css'
import { useSelector } from 'react-redux'
import { format, parseISO } from 'date-fns'
import { Icon, InlineIcon } from '@iconify/react'
import phone from '@iconify/icons-mdi/phone'
import iconoVisto from '@iconify/icons-mdi/check-all'
import iconoVolver from '@iconify/icons-mdi/arrow-back'

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
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
