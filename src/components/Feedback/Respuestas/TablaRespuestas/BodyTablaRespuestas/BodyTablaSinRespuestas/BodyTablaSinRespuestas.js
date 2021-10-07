import Icon from '@iconify/react'
import iconoSinRepuestas from '@iconify/icons-mdi/checkbox-blank-off-outline'
import './BodyTablaSinRespuestas.css'
import { useSelector } from 'react-redux'
import { isToday } from 'date-fns'

const BodyTablaSinRespuestas = () => {

  const { fechaTermino } = useSelector(state => state.respuestas)

  return (
    <div className="BodyTablaSinRespuestas">
      <Icon className="BodyTablaSinRespuestas__icono" icon={iconoSinRepuestas} />
      <p>No se encontraron respuestas</p>
      {isToday(fechaTermino) && <p>Las interacciones con los pacientes<br />comienzan a las <strong>8:30</strong> normalmente</p> }
    </div>
  )
}

export default BodyTablaSinRespuestas