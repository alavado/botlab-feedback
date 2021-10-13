import Icon from '@iconify/react'
import iconoSinRepuestas from '@iconify/icons-mdi/robot-confused'
import iconoTodaviaNo from '@iconify/icons-mdi/robot'
import './BodyTablaSinRespuestas.css'
import { useSelector } from 'react-redux'
import { isAfter } from 'date-fns'
import endOfYesterday from 'date-fns/endOfYesterday'

const BodyTablaSinRespuestas = () => {

  const { fechaTermino } = useSelector(state => state.respuestas)
  const { tipos, idEncuestaSeleccionada } = useSelector(state => state.encuestas)

  if (!idEncuestaSeleccionada) {
    return null
  }

  const encuestaSeleccionada = tipos.find(({ id }) => id === idEncuestaSeleccionada)
  const horaInicio = encuestaSeleccionada.integrations?.[0].start_time
  const todaviaNo = horaInicio && isAfter(fechaTermino, endOfYesterday())

  return (
    <div className="BodyTablaSinRespuestas">
      <Icon className="BodyTablaSinRespuestas__icono" icon={todaviaNo ? iconoTodaviaNo : iconoSinRepuestas} />
      {todaviaNo
        ? <p>Las interacciones con pacientes<br />comienzan a las <strong>{horaInicio.slice(0, 5)}</strong></p>
        : <p>No se encontraron respuestas</p>
      }
    </div>
  )
}

export default BodyTablaSinRespuestas