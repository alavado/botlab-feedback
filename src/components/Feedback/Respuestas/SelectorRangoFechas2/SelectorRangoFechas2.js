import { format, isSameDay, isToday, isYesterday } from 'date-fns'
import { es } from 'date-fns/locale'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { guardaRangoFechas } from '../../../../redux/ducks/respuestas'
import Calendario from './Calendario'
import './SelectorRangoFechas2.css'

const SelectorRangoFechas2 = () => {

  const { fechaInicio } = useSelector(state => state.respuestas)
  const [fechaSeleccionada, setFechaSeleccionada] = useState(fechaInicio || new Date())
  const [calendarioVisible, setCalendarioVisible] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    if (!isSameDay(fechaInicio, fechaSeleccionada)) {
      dispatch(guardaRangoFechas([fechaSeleccionada, fechaSeleccionada]))
    }
  }, [dispatch, fechaInicio, fechaSeleccionada])

  return (
    <div className="SelectorRangoFechas2">
      <div className="SelectorRangoFechas2__label">Fecha chats:</div>
      <div className="SelectorRangoFechas2__contenedor_calendario">
        <button
          className="SelectorRangoFechas2__boton_principal"
          onClick={() => setCalendarioVisible(true)}
        >
          {isToday(fechaSeleccionada) && 'hoy, '} {isYesterday(fechaSeleccionada) && 'ayer, '} {format(fechaSeleccionada, 'iiii d \'de\' MMMM', { locale: es })}
        </button>
        {calendarioVisible && (
          <Calendario
            ocultar={() => setCalendarioVisible(false)} 
            seleccionarFecha={setFechaSeleccionada} 
          />
        )}
      </div>
      <button>
        Rango...
      </button>
    </div>
  )
}

export default SelectorRangoFechas2