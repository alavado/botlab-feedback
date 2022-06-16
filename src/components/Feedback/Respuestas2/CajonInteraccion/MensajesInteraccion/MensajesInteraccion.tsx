import { InlineIcon } from '@iconify/react'
import classNames from 'classnames'
import AvatarUsuarios from '../AvatarUsuarios'
import { format, isSameDay, isYesterday, isToday } from 'date-fns'
import iconoBot from '@iconify/icons-mdi/robot'
import './MensajesInteraccion.css'
import { useComentariosInteraccionActivaQuery, useInteraccionActivaQuery } from '../../../../../api/hooks'
import React, { useEffect } from 'react'
import { Mensaje } from '../../../../../api/types/servicio'
import iconoCalendario from '@iconify/icons-mdi/calendar-check'
import es from 'date-fns/esm/locale/es/index.js'

const MensajesInteraccion = () => {

  const { data: dataInteraccionActiva } = useInteraccionActivaQuery()
  useComentariosInteraccionActivaQuery()

  useEffect(() => {
    const fechas = document.querySelectorAll('.MensajesInteraccion__dia_mensajes')
    if (fechas.length > 0) {
      fechas[fechas.length - 1].scrollIntoView()
      document.querySelector('.MensajesInteraccion')?.scrollBy({ top: -8 })
    }
  }, [dataInteraccionActiva])

  if (!dataInteraccionActiva?.conversaciones) {
    return <div className="MensajesInteraccion__skeleton" />
  }

  const mensajes = dataInteraccionActiva.conversaciones.map(c => c.mensajes).flat()

  return (
    <div className="MensajesInteraccion">
      {mensajes.map((mensaje: Mensaje, i: number) => {
        return (
          <React.Fragment key={`mensaje-${i}`}>
            {(i === 0 || !isSameDay(mensajes[i - 1].timestamp, mensaje.timestamp)) && (
              <div className="MensajesInteraccion__dia_mensajes">
                <InlineIcon icon={iconoCalendario} /> {(isYesterday(mensaje.timestamp) ? 'ayer, ' : '') + (isToday(mensaje.timestamp) ? 'hoy, ' : '') + format(mensaje.timestamp, 'EEEE d \'de\' MMMM', { locale: es })}
              </div>
            )}
            <div
              key={`mensaje-${i}`}
              className={classNames({
                "MensajesInteraccion__mensaje": true,
                "MensajesInteraccion__mensaje--usuario": mensaje.emisor === 'USUARIO',
                "MensajesInteraccion__mensaje--bot": mensaje.emisor === 'BOT'
              })}
            >
              <p className="MensajesInteraccion__mensaje_emisor">
                {mensaje.emisor === 'BOT' && <InlineIcon icon={iconoBot} />}
                {mensaje.emisor === 'BOT'
                  ? <span className="MensajesInteraccion__mensaje_nombre_emisor">{dataInteraccionActiva.nombreBot} (Bot)</span>
                  : <>
                      <span className="MensajesInteraccion__mensaje_avatar" style={{ opacity: 1 }}>
                        <AvatarUsuarios />
                      </span>
                      <span className="MensajesInteraccion__mensaje_nombre_emisor">
                        {dataInteraccionActiva.citas.map((cita: any) => cita.nombre.split(' ')[0]).join(', ')}
                      </span>
                    </>
                }
              </p>
              <p className="MensajesInteraccion__mensaje_hora">{format(mensaje.timestamp, 'HH:mm')}</p>
              <p className="MensajesInteraccion__mensaje_contenido">{mensaje.mensaje}</p>
            </div>
          </React.Fragment>
        )
      })}
    </div>
  )
}

export default MensajesInteraccion