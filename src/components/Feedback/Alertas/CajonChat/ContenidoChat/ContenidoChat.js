import classNames from 'classnames'
import { format, isSameDay, isToday, isTomorrow, isYesterday, parse, parseISO, startOfDay } from 'date-fns'
import { formatToTimeZone } from 'date-fns-timezone'
import { useQuery } from 'react-query'
import { useSelector } from 'react-redux'
import { chat2 } from '../../../../../api/endpoints'
import Loader from '../../../../Loader'
import _ from 'lodash'
import './ContenidoChat.css'
import { es } from 'date-fns/locale'

const ContenidoChat = () => {

  const { alertaDestacada } = useSelector(state => state.alertas)
  const { isLoading, data } = useQuery(
    ['chat', alertaDestacada.poll_id, alertaDestacada.user_id],
    () => chat2(alertaDestacada.poll_id, alertaDestacada.user_id),
    {
      refetchOnMount: true,
      refetchInterval: 30_000
    }
  )

  if (isLoading) {
    return <Loader />
  }

  const conversaciones = data.data.data.conversations

  let eventos = _.flatten(
    conversaciones.map(conversacion => {
      const fecha = conversacion.context.find(p => p.target.includes('date')).value
      const hora = conversacion.context.find(p => p.target.includes('time')).value
      const doctor = conversacion.context.find(p => p.target.includes('dentist') || p.target.includes('doctor')).value
      return [
        ...conversacion.messages.map(m => ({
          tipo: m.type === 'bot' ? 'mensaje bot' : 'mensaje usuario',
          fecha: parseISO(m.timestamp),
          fechaFormateada: function() { return format(this.fecha, 'h:mm aaaa') },
          contenido: m.message
        })),
        {
          tipo: 'cita',
          fecha: parse(`${fecha} ${hora}`, hora.includes('M') ? 'd \'de\' MMMM h:m a' : 'd \'de\' MMMM H:m', parseISO(conversacion.start), { locale: es }),
          fechaFormateada: function() { return format(this.fecha, 'h:mm aaaa') },
          contenido: `🕑 Paciente agendó cita con ${doctor} a las ${hora}`
        }
      ]
    }))
  
  eventos.push({
    tipo: 'alerta',
    fecha: parseISO(alertaDestacada.utc_timestamp),
    fechaFormateada: function() { return formatToTimeZone(this.fecha, 'EEEE d \'de\' MMMM', { timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone }) },
    contenido: alertaDestacada.message
  })
  
  eventos.sort((e1, e2) => e1.fecha < e2.fecha ? -1 : 1);
  [...eventos].forEach((e, i) => {
    if (i === 0 || !isSameDay(e.fecha, eventos[i - 1].fecha)) {
      eventos.push({
        tipo: 'dia',
        fecha: startOfDay(e.fecha),
        fechaFormateada: function() { return format(this.fecha, 'hh:m aaaa') },
        contenido: (isYesterday(e.fecha) ? 'ayer, ' : '') + (isToday(e.fecha) ? 'hoy, ' : '') + (isTomorrow(e.fecha) ? 'mañana, ' : '') + format(e.fecha, 'EEEE d \'de\' MMMM', { locale: es })
      })
    }
  })
  eventos.sort((e1, e2) => e1.fecha < e2.fecha ? -1 : 1);
  
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
          })}
          key={`evento-chat-${i}`}
        >
          <span>{e.contenido}</span>
          <span className="ContenidoChat__fecha_mensaje">{e.fechaFormateada()}</span>
        </div>
      ))}
    </div>
  )
}

export default ContenidoChat