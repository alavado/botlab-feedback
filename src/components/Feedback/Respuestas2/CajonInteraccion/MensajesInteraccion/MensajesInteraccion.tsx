import { InlineIcon } from '@iconify/react'
import classNames from 'classnames'
import AvatarUsuarios from '../AvatarUsuarios'
import { format, isSameDay, isYesterday, isToday } from 'date-fns'
import './MensajesInteraccion.css'
import { useComentariosInteraccionActivaQuery, useInteraccionActivaQuery } from '../../../../../api/hooks'
import React, { useEffect, useState } from 'react'
import { Comentario, Mensaje } from '../../../../../api/types/servicio'
import es from 'date-fns/esm/locale/es/index.js'
import Linkify from 'linkify-react'

const esMensaje = (elemento: Mensaje | Comentario): elemento is Mensaje => {
  return (elemento as Mensaje).mensaje !== undefined;
}

const formatearMensaje = (mensaje: String, id: number) => {
  const mensajeConNegritas = mensaje
    .split('*')
    .map((m, i) => (
      <span
        key={`parte-mensaje-${id}-${i}`}
        style={{ fontWeight: i % 2 > 0 ? 'bold' : 'normal' }}
      >
        {m}
      </span>
    ))
  return (
    <Linkify
      options={{
        nl2br: true,
        target: '_blank',
        truncate: 30,
        attributes: {
          title: 'Enlace externo'
        }
      }}
    >
      {mensajeConNegritas}
    </Linkify>
  )
}

const MensajesInteraccion = () => {

  const { data: dataInteraccionActiva } = useInteraccionActivaQuery()
  const [autoScroll, setAutoScroll] = useState(true)
  const { isLoading } = useComentariosInteraccionActivaQuery()

  useEffect(() => {
    if (isLoading || !autoScroll) {
      return
    }
    const fechas = document.querySelectorAll('.MensajesInteraccion__dia_mensajes')
    if (fechas.length > 0) {
      fechas[fechas.length - 1].scrollIntoView()
      document.querySelector('.MensajesInteraccion')?.scrollBy({ top: -8 })
      setAutoScroll(false)
    }
  }, [dataInteraccionActiva, isLoading, autoScroll])

  useEffect(() => {
    setAutoScroll(true)
  }, [dataInteraccionActiva?.idUsuario])

  if (!dataInteraccionActiva?.conversaciones || isLoading) {
    return <div className="MensajesInteraccion__skeleton" />
  }

  const mensajes = dataInteraccionActiva.conversaciones.map(c => c.mensajes).flat()
  const mensajesYComentarios: (Mensaje | Comentario)[] = [...mensajes, ...dataInteraccionActiva.comentarios]
  mensajesYComentarios.sort((m1, m2) => m1.timestamp < m2.timestamp ? -1 : 1)
  const ultimaConversacion = dataInteraccionActiva.conversaciones.slice(-1)[0]
  const indicePrimerMensajeUltimaConversacion = mensajesYComentarios.findIndex(c => isSameDay(c.timestamp, ultimaConversacion.inicio))

  return (
    <div className="MensajesInteraccion">
      {mensajesYComentarios.map((mensajeOComentario: Mensaje | Comentario, i: number) => {
        if (esMensaje(mensajeOComentario)) {
          const { timestamp, emisor, mensaje } = mensajeOComentario
          return (
            <React.Fragment key={`mensaje-${i}-${timestamp}`}>
              {(i === 0 || !isSameDay(mensajesYComentarios[i - 1].timestamp, timestamp)) && (
                <div className="MensajesInteraccion__dia_mensajes">
                  <InlineIcon icon="mdi:calendar-check" /> {(isYesterday(timestamp) ? 'ayer, ' : '') + (isToday(timestamp) ? 'hoy, ' : '') + format(timestamp, 'EEEE d \'de\' MMMM', { locale: es })}
                </div>
              )}
              <div
                className={classNames({
                  "MensajesInteraccion__mensaje": true,
                  "MensajesInteraccion__mensaje--usuario": emisor === 'USUARIO',
                  "MensajesInteraccion__mensaje--bot": emisor === 'BOT'
                })}
                style={{ animationDelay: `${Math.max(0, i - indicePrimerMensajeUltimaConversacion) * .05}s` }}
              >
                <p className="MensajesInteraccion__mensaje_emisor">
                  {emisor === 'BOT' && <InlineIcon icon="mdi:robot" />}
                  {emisor === 'BOT'
                    ? <span className="MensajesInteraccion__mensaje_nombre_emisor">{dataInteraccionActiva.nombreBot} (Bot)</span>
                    : <>
                        <span className="MensajesInteraccion__mensaje_avatar" style={{ opacity: 1 }}>
                          <AvatarUsuarios />
                        </span>
                        <span className="MensajesInteraccion__mensaje_nombre_emisor">
                          {dataInteraccionActiva.citas?.map((cita: any) => cita.nombre.split(' ')[0]).join(', ')}
                        </span>
                      </>
                  }
                </p>
                <p className="MensajesInteraccion__mensaje_hora">{format(timestamp, 'HH:mm')}</p>
                <p className="MensajesInteraccion__mensaje_contenido">{formatearMensaje(mensaje, i)}</p>
              </div>
            </React.Fragment>
          )
        }
        else {
          const { texto, emoji, timestamp } = mensajeOComentario
          return (
            <div
              className="MensajesInteraccion__comentario"
              key={`comentario-${i}-${timestamp}`}
              style={{ animationDelay: `${Math.max(0, i - indicePrimerMensajeUltimaConversacion) * .05}s` }}
            >
              <p className="MensajesInteraccion__comentario_emisor">
                <InlineIcon icon="mdi:comment-check" /> Comentario (visible solo en Feedback)
              </p>
              <p className="MensajesInteraccion__comentario_hora">{format(timestamp, 'HH:mm')}</p>
              <p className="MensajesInteraccion__comentario_contenido">{emoji} {texto}</p>
            </div>
          )
        }
      })}
    </div>
  )
}

export default MensajesInteraccion