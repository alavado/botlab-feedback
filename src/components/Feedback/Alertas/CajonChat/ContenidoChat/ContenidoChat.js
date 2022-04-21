import classNames from 'classnames'
import { addMinutes, format, isFuture, isSameDay, isToday, isTomorrow, isYesterday, parse, parseISO, startOfDay } from 'date-fns'
import { useQuery } from 'react-query'
import { useSelector } from 'react-redux'
import { chat2 } from '../../../../../api/endpoints'
import Loader from '../../../../Loader'
import _ from 'lodash'
import './ContenidoChat.css'
import { es } from 'date-fns/locale'
import { InlineIcon } from '@iconify/react'
import { useEffect, useMemo } from 'react'
import Linkify from 'react-linkify'
import nl2br from 'react-newline-to-break'
import { alertas as getAlertas } from '../../../../../api/endpoints'
import { obtenerIconoAlerta } from '../../../../../helpers/alertas'
import iconoRobot from '@iconify/icons-mdi/robot'

const ContenidoChat = () => {

  const { idAlertaDestacada } = useSelector(state => state.alertas)
  const { data: dataAlertas } = useQuery('alertas', getAlertas)
  const alertaDestacada = dataAlertas.data.find(a => a.id === idAlertaDestacada)
  const { isLoading, data } = useQuery(
    ['chat', alertaDestacada.poll_id, alertaDestacada.user_id],
    () => chat2(alertaDestacada.poll_id, alertaDestacada.user_id),
    {
      refetchOnMount: true,
      refetchInterval: 30_000
    }
  )

  const eventos = useMemo(() => {
    if (!data) {
      return []
    }
    const conversaciones = data.data.data.conversations
    const eventos = _.flatten(
      conversaciones.map(conversacion => {
        const fecha = conversacion.context.find(p => p.target.includes('date')).value
        const hora = conversacion.context.find(p => p.target.includes('time')).value
        const doctor = conversacion.context.find(p => p.target.includes('dentist') || p.target.includes('doctor')).value
        return [
          ...conversacion.messages.map(m => ({
            tipo: m.type === 'bot' ? 'mensaje bot' : 'mensaje usuario',
            fecha: parseISO(m.timestamp),
            formato: 'h:mm aaaa',
            contenido: nl2br(m.message)
          })),
          {
            tipo: 'cita',
            fecha: parse(`${fecha} ${hora}`, hora.includes('M') ? 'd \'de\' MMMM h:m a' : 'd \'de\' MMMM H:m', parseISO(conversacion.start), { locale: es }),
            formato: 'h:mm aaaa',
            contenido: `🕑 Cita con ${doctor} a las ${hora}`
          }
        ]
      }
    ))
      
    eventos.push({
      tipo: alertaDestacada.dismissed ? 'alerta-resuelta' : 'alerta',
      fecha: addMinutes(parseISO(alertaDestacada.utc_timestamp), -(new Date().getTimezoneOffset())),
      formato: 'h:mm aaaa',
      contenido: (
        <span className="ContenidoChat__contenido_alerta">
          <InlineIcon style={{ fontSize: '1rem' }} icon={iconoRobot} />
          {alertaDestacada.message}
        </span>
      )
    })
      
    eventos.sort((e1, e2) => e1.fecha < e2.fecha ? -1 : 1);
    [...eventos].forEach((e, i) => {
      if (i === 0 || !isSameDay(e.fecha, eventos[i - 1].fecha)) {
        eventos.push({
          tipo: 'dia',
          fecha: startOfDay(e.fecha),
          formato: 'hh:m aaaa',
          contenido: '📅 ' + (isYesterday(e.fecha) ? 'ayer, ' : '') + (isToday(e.fecha) ? 'hoy, ' : '') + (isTomorrow(e.fecha) ? 'mañana, ' : '') + format(e.fecha, 'EEEE d \'de\' MMMM', { locale: es })
        })
      }
    })
    eventos.sort((e1, e2) => e1.fecha < e2.fecha ? -1 : 1)
    return eventos.filter(e => !isFuture(e.fecha))
  }, [data, alertaDestacada])

  useEffect(() => {
    const elementoAlerta = document.querySelector('.ContenidoChat__mensaje--alerta')
    elementoAlerta?.scrollIntoView()
    const elementoContenido = document.querySelector('.ContenidoChat')
    elementoContenido?.scrollBy(0, -elementoContenido?.clientHeight / 5)
  }, [eventos.length])

  if (isLoading) {
    return (
      <div className="ContenidoChat__loader">
        <Loader color="var(--color-principal)" />
        <p>Cargando mensajes...</p>
      </div>
    )
  }

  return (
    <div className="ContenidoChat">
      {eventos.map((e, i) => (
        <div
          className={classNames({
            "ContenidoChat__mensaje": e.tipo === 'mensaje bot' || e.tipo === 'mensaje usuario',
            "ContenidoChat__mensaje--bot": e.tipo === 'mensaje bot',
            "ContenidoChat__mensaje--usuario": e.tipo === 'mensaje usuario',
            "ContenidoChat__mensaje--cita": e.tipo === 'cita',
            "ContenidoChat__mensaje--dia": e.tipo === 'dia',
            "ContenidoChat__mensaje--alerta": e.tipo === 'alerta',
            "ContenidoChat__mensaje--alerta ContenidoChat__mensaje--alerta-resuelta": e.tipo === 'alerta-resuelta',
          })}
          key={`evento-chat-${i}`}
        >
          <span>
            <Linkify>
              {e.contenido}
            </Linkify>
          </span>
          <span className="ContenidoChat__fecha_mensaje">
            {format(e.fecha, e.formato)}
          </span>
        </div>
      ))}
      {/* <button
        className="ContenidoChat__boton_comentario"
      >
        <span>💬</span> Agregar comentario
      </button> */}
    </div>
  )
}

export default ContenidoChat