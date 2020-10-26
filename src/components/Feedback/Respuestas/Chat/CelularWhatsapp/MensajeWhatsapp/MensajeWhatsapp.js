import React from 'react'
import { format, parseISO } from 'date-fns'
import { InlineIcon } from '@iconify/react'
import iconoVisto from '@iconify/icons-mdi/check-all'
import iconoArchivo from '@iconify/icons-mdi/file-pdf-outline'
import classNames from 'classnames'
import { es } from 'date-fns/locale'
import './MensajeWhatsapp.css'

const MensajeWhatsapp = ({ mensaje, mensajes, posicion }) => {

  const ts = parseISO(mensaje.timestamp)
  const horaMensaje = format(ts, 'HH:mm')
  const fechaMensaje = format(ts, 'd \'de\' MMMM \'de\' yyyy', { locale: es })
  const diaMensaje = format(ts, 'd')
  const diaMensajeAnterior = posicion > 0 && format(parseISO(mensajes[posicion - 1].timestamp), 'd')
  const mensajeEsDeHumano = mensaje.type !== 'bot'
  const mostrarFecha = posicion === 0 || diaMensaje !== diaMensajeAnterior

  return (
    <div className="MensajeWhatsapp">
      {mostrarFecha &&
        <div className="MensajeWhatsapp__fecha">
          {fechaMensaje}
        </div>
      }
      <div
        className={classNames({
          'MensajeWhatsapp__globo': true,
          'MensajeWhatsapp__globo--entrante': !mensajeEsDeHumano,
          'MensajeWhatsapp__globo--saliente': mensajeEsDeHumano
        })}
        style={{ animationDelay: `${posicion * .15}s` }}
      >
        <div className="MensajeWhatsapp__texto">
          {texto(mensaje)}
          <div className="MensajeWhatsapp__hora">
            {horaMensaje}
            {mensajeEsDeHumano && visto}
          </div>
        </div>
        <div className="MensajeWhatsapp__hora_visible">
          {horaMensaje}
          {mensajeEsDeHumano && visto}
        </div>
      </div>
    </div>
  )
}

const visto = () => (
  <InlineIcon
    className="MensajeWhatsapp__icono_visto"
    icon={iconoVisto}
  />
)

const texto = mensaje => mensaje.message.indexOf('ATTACHMENT') > 0
  ? <>
      <InlineIcon className="MensajeWhatsapp__pdf" icon={iconoArchivo} />
      {mensaje.message.slice(0, mensaje.message.indexOf('ATTACHMENT'))}
    </>
  : mensaje.message

export default MensajeWhatsapp
