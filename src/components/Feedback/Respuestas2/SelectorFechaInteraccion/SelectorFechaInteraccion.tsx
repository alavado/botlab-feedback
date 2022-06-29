import { InlineIcon } from '@iconify/react'
import { format, isSameDay, isToday, isTomorrow, isYesterday, startOfMonth, startOfWeek } from 'date-fns'
import { addDays, endOfMonth, endOfWeek } from 'date-fns/esm'
import { es } from 'date-fns/locale'
import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../../redux/ducks'
import { seleccionaFechaInicio } from '../../../../redux/ducks/servicio'
import './SelectorFechaInteraccion.css'

const SelectorFechaInteraccion = () => {

  const [calendarioActivo, setCalendarioActivo] = useState(false)
  const { fechaInicio } = useSelector((state: RootState) => state.servicio)
  const dispatch = useDispatch()

  const fecha = useMemo(() => {
    return (isYesterday(fechaInicio) ? 'ayer, ' : '') +
      (isToday(fechaInicio) ? 'hoy, ' : '') +
      (isTomorrow(fechaInicio) ? 'mañana, ' : '') +
      format(fechaInicio, 'EEEE d \'de\' MMMM', { locale: es })
  }, [fechaInicio])

  const diasMes = useMemo(() => {
    let dia = startOfWeek(startOfMonth(fechaInicio), { locale: es })
    let dias = [dia]
    const ultimoDia = endOfWeek(endOfMonth(fechaInicio), { locale: es })
    while (!isSameDay(dia, ultimoDia)) {
      dia = addDays(dia, 1)
      dias.push(dia)
    }
    return dias
  }, [fechaInicio])

  return (
    <div className="SelectorFechaInteraccion">
      <button
        className="SelectorFechaInteraccion__boton"
        onClick={() => setCalendarioActivo(!calendarioActivo)}
      >
        <InlineIcon icon="mdi:calendar-check" />
        {fecha}
        <InlineIcon icon="mdi:triangle-small-down" />
      </button>
      {calendarioActivo && (
        <div className="SelectorFechaInteraccion__calendario">
          <div>Lu</div>
          <div>Ma</div>
          <div>Mi</div>
          <div>Ju</div>
          <div>Vi</div>
          <div>Sá</div>
          <div>Do</div>
          {diasMes.map((dia, i) => (
            <button
              onClick={() => dispatch(seleccionaFechaInicio(dia))}
              key={`celendario-dia-${i}`}
            >
              {format(dia, 'd')}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default SelectorFechaInteraccion