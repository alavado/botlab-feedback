import { Icon } from '@iconify/react'
import classNames from 'classnames'
import { addDays, addMonths, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, startOfMonth, startOfWeek } from 'date-fns'
import { es } from 'date-fns/locale'
import { useMemo, useState } from 'react'
import OutsideClickHandler from 'react-outside-click-handler'
import './Calendario.css'

const Calendario = ({ ocultar, seleccionarFecha }) => {

  const [mes, setMes] = useState(new Date())

  const fechas = useMemo(() => {
    let fecha = startOfWeek(startOfMonth(mes), { locale: es })
    const fin = addDays(endOfWeek(endOfMonth(mes), { locale: es }), 1)
    const fechasMes = []
    while (!isSameDay(fecha, fin)) {
      fechasMes.push(fecha)
      fecha = addDays(fecha, 1)
    }
    return fechasMes
  }, [mes])

  return (
    <OutsideClickHandler onOutsideClick={ocultar}>
      <div className="Calendario">
        <div className="Calendario__selector_mes">
          <button
            onClick={() => setMes(mes => addMonths(mes, -1))}
            className="Calendario__boton_selector_mes"
          >
            <Icon icon="mdi:chevron-left" />
          </button>
          {format(mes, 'MMMM yyyy', { locale: es })}
          <button
            onClick={() => setMes(mes => addMonths(mes, 1))}
            disabled={isSameMonth(mes, new Date())}
            className="Calendario__boton_selector_mes"
          >
            <Icon icon="mdi:chevron-right" />
          </button>
        </div>
        <div className="Calendario__contenedor_dias">
          <div className="Calendario__abreviacion_dia">Lu</div>
          <div className="Calendario__abreviacion_dia">Ma</div>
          <div className="Calendario__abreviacion_dia">Mi</div>
          <div className="Calendario__abreviacion_dia">Ju</div>
          <div className="Calendario__abreviacion_dia">Vi</div>
          <div className="Calendario__abreviacion_dia">Sá</div>
          <div className="Calendario__abreviacion_dia">Do</div>
          {fechas.map((f, i) => (
            <button
              key={`boton-calendario-${i}`}
              onClick={() => {
                seleccionarFecha(f)
                ocultar()
              }}
            >
              {format(f, 'd')}
            </button>
          ))}
          </div>
        </div>
    </OutsideClickHandler>
  )
}

export default Calendario