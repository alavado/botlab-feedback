import { InlineIcon } from '@iconify/react'
import classNames from 'classnames'
import AvatarUsuarios from '../AvatarUsuarios'
import { format } from 'date-fns'
import iconoBot from '@iconify/icons-mdi/robot'
import './MensajesInteraccion.css'
import { useInteraccionActivaQuery } from '../../../../../api/hooks'

const MensajesInteraccion = () => {

  const { data } = useInteraccionActivaQuery()

  return data?.conversaciones
    ? <div className="MensajesInteraccion">
        {data.conversaciones.map((conversacion: any) => (
            conversacion.mensajes.map((mensaje: any) => (
              <div
                className={classNames({
                  "CajonInteraccion__mensaje": true,
                  "CajonInteraccion__mensaje--usuario": mensaje.emisor === 'USUARIO',
                  "CajonInteraccion__mensaje--bot": mensaje.emisor === 'BOT'
                })}
              >
                <p className="CajonInteraccion__mensaje_emisor">
                  {mensaje.emisor === 'BOT' && <InlineIcon icon={iconoBot} />}
                  {mensaje.emisor === 'BOT'
                    ? `${data.nombreBot} (Bot)`
                    : <>
                        <div className="CajonInteraccion__avatar_mensaje" style={{ opacity: 1 }}>
                          <AvatarUsuarios />
                        </div>
                        <span className="CajonInteraccion__nombre_emisor_mensaje">
                          {data.citas.map((cita: any) => cita.nombre.split(' ')[0]).join(', ')}
                        </span>
                      </>
                  }
                </p>
                <p className="CajonInteraccion__mensaje_hora">{format(mensaje.timestamp, 'HH:mm')}</p>
                <p className="CajonInteraccion__mensaje_contenido">{mensaje.mensaje}</p>
              </div>
            ))
          ))}
      </div>
    : <div className="MensajesInteraccion__skeleton" />
}

export default MensajesInteraccion