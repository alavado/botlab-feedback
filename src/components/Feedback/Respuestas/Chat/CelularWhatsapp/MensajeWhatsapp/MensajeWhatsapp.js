import React from 'react'
import { format, parseISO } from 'date-fns'
import { InlineIcon } from '@iconify/react'
import iconoVisto from '@iconify/icons-mdi/check-all'
import iconoArchivo from '@iconify/icons-mdi/file-pdf-outline'
import classNames from 'classnames'
import { es } from 'date-fns/locale'
import Linkify from 'react-linkify'
import nl2br from 'react-newline-to-break'
import './MensajeWhatsapp.css'

const MensajeWhatsapp = ({ mensaje, mensajes, posicion }) => {

  const ts = parseISO(mensaje.timestamp)
  const horaMensaje = format(ts, 'HH:mm')
  const fechaMensaje = format(ts, 'd \'de\' MMMM \'de\' yyyy', { locale: es })
  const horaFechamensaje = format(ts, 'd MMM yy\',\' HH:mm', { locale: es })
  const diaMensaje = format(ts, 'd')
  const diaMensajeAnterior = posicion > 0 && format(parseISO(mensajes[posicion - 1].timestamp), 'd')
  const mostrarFecha = posicion === 0 || diaMensaje !== diaMensajeAnterior
  const mensajeEsDeHumano = mensaje.type !== 'bot'

  return (
    <div className="MensajeWhatsapp">
      {mostrarFecha && <Fecha fecha={fechaMensaje} />}
      <Globo esDeHumano={mensajeEsDeHumano} posicion={posicion} hora={horaFechamensaje}>
        <Texto mensaje={mensaje} esDeHumano={mensajeEsDeHumano} hora={horaMensaje} />
        <Hora hora={horaMensaje} esDeHumano={mensajeEsDeHumano} />
      </Globo>
    </div>
  )
}

const Fecha = ({ fecha }) => (
  <div className="MensajeWhatsapp__fecha">
    {fecha}
  </div>
)

const Globo = ({ esDeHumano, posicion, hora, children }) => (
  <div
    className={classNames({
      'MensajeWhatsapp__globo': true,
      'MensajeWhatsapp__globo--saliente': esDeHumano,
      'MensajeWhatsapp__globo--entrante': !esDeHumano
    })}
    // style={{ animationDelay: `${posicion * .15}s` }}
  >
    <div className="MensajeWhatsapp__titulo">
      <div>{esDeHumano ? 'Usuario' : 'Bot'}</div>
      <div className="MensajeWhatsapp__titulo_hora">{hora}</div>
    </div>
    {children}
  </div>
)

const Texto = ({ mensaje, hora, esDeHumano }) => {

  const marcar = texto => {
    return texto.map(t => {
      const partes = t.props.children[0].split('*')
      return {
        ...t,
        props: {
          ...t.props,
          children: [
            React.createElement(
              'span',
              [],
              partes.map((p, i) => 0 < i && i < partes.length - 1
                ? <strong className="MensajeWhatsapp__strong" key={Date.now()}>{p}</strong>
                : p
              )
            ),
            ...t.props.children.slice(1)
          ]
        }
      }
    })
  }
  const indiceAdjunto = mensaje.message.indexOf('ATTACHMENT')

  return (
    <div className="MensajeWhatsapp__texto">
      {indiceAdjunto > 0
        ? <a
            target="_blank"
            rel="noreferrer noopener"
            className="MensajeWhatsapp__link_archivo"
            href={mensaje.message.slice(mensaje.message.indexOf('http'))}
          >
            <InlineIcon className="MensajeWhatsapp__pdf" icon={iconoArchivo} />
            {mensaje.message.slice(0, indiceAdjunto)}
          </a>
        : <Linkify>
            <span className="MensajeWhatsapp__texto_nl2br">
              {marcar(nl2br(mensaje.message))}
            </span>
          </Linkify>
      }
      <Hora hora={hora} escondida={true} esDeHumano={esDeHumano} />
    </div>
  )
}

const Hora = ({ hora, esDeHumano, escondida }) => (
  <div className={escondida ? 'MensajeWhatsapp__hora' : 'MensajeWhatsapp__hora_visible' }>
    {hora}
    {esDeHumano && <Visto />}
  </div>
)

const Visto = () => (
  <InlineIcon
    className="MensajeWhatsapp__icono_visto"
    icon={iconoVisto}
  />
)

export default MensajeWhatsapp
