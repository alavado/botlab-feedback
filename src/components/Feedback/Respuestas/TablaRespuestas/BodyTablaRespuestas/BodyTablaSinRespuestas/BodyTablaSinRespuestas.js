import Icon from '@iconify/react'
import iconoSinRepuestas from '@iconify/icons-mdi/checkbox-blank-off-outline'
import './BodyTablaSinRespuestas.css'
import { useSelector } from 'react-redux'
import { isToday } from 'date-fns'

const BodyTablaSinRespuestas = () => {

  const { fechaTermino } = useSelector(state => state.respuestas)
  const { tipos, idEncuestaSeleccionada } = useSelector(state => state.encuestas)

  if (!idEncuestaSeleccionada) {
    return null
  }

  const encuestaSeleccionada = tipos.find(({ id }) => id === idEncuestaSeleccionada)
  const horaInicio = encuestaSeleccionada.integrations?.[0].start_time

  return (
    <div className="BodyTablaSinRespuestas">
      <Icon className="BodyTablaSinRespuestas__icono" icon={iconoSinRepuestas} />
      <p>No se encontraron respuestas</p>
      {isToday(fechaTermino) && horaInicio && <p>Las interacciones con pacientes<br />comienzan a las <strong>{horaInicio}</strong></p> }
    </div>
  )
}

export default BodyTablaSinRespuestas