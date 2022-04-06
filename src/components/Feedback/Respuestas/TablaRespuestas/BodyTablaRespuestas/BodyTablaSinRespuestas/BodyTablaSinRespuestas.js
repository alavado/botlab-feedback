import Icon from '@iconify/react'
import iconoSinRepuestas from '@iconify/icons-mdi/robot-confused'
import iconoTodaviaNo from '@iconify/icons-mdi/robot'
import './BodyTablaSinRespuestas.css'
import { useSelector } from 'react-redux'
import { isAfter, setHours, setMinutes } from 'date-fns'

const BodyTablaSinRespuestas = () => {

  const { fechaTermino, filtros } = useSelector(state => state.respuestas)
  const { tipos, idEncuestaSeleccionada } = useSelector(state => state.encuestas)

  if (!idEncuestaSeleccionada) {
    return null
  }

  const hayFiltros = filtros?.length > 0
  const encuestaSeleccionada = tipos.find(({ id }) => id === idEncuestaSeleccionada)
  const horaInicio = encuestaSeleccionada.integrations?.[0]?.start_time?.slice(0, 5)
  const yaFue = horaInicio && isAfter(Date.now(), setMinutes(setHours(fechaTermino, Number(horaInicio.slice(0, 2))), 0))

  let icono = iconoSinRepuestas
  let mensaje = <p>No hay respuestas</p>
  if (hayFiltros) {
    mensaje = <p>Su búsqueda no tuvo resultados</p>
    icono = iconoSinRepuestas
  }
  else if (horaInicio && !yaFue) {
    const [horas, minutos] = horaInicio.split(':')
    mensaje = <p>Las interacciones con pacientes<br />comienzan a las <strong>{horas}:{minutos}</strong></p>
    icono = iconoTodaviaNo
  }


  return (
    <span className="BodyTablaSinRespuestas">
      <Icon className="BodyTablaSinRespuestas__icono" icon={icono} />
      {mensaje}
    </span>
  )
}

export default BodyTablaSinRespuestas