import { Icon } from '@iconify/react'
import classNames from 'classnames'
import { addDays, addMonths, endOfMonth, endOfWeek, format, isFuture, isSameDay, isSameMonth, isSunday, isToday, startOfMonth, startOfWeek } from 'date-fns'
import { es } from 'date-fns/locale'
import { useMemo, useState } from 'react'
import OutsideClickHandler from 'react-outside-click-handler'
import './Calendario.css'

const Calendario = ({ ocultar, fechaSeleccionada, seleccionarFecha }) => {

  const [mes, setMes] = useState(endOfWeek(fechaSeleccionada, { locale: es }))

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
            title="Mes anterior"
          >
            <Icon icon="mdi:chevron-left" />
          </button>
          {format(mes, 'MMMM yyyy', { locale: es })}
          <button
            onClick={() => setMes(mes => addMonths(mes, 1))}
            disabled={isSameMonth(mes, new Date())}
            className="Calendario__boton_selector_mes"
            title="Mes siguiente"
          >
            <Icon icon="mdi:chevron-right" />
          </button>
        </div>
        <div className="Calendario__contenedor_encabezados_dias">
          <div className="Calendario__encabezado_dia">Lu</div>
          <div className="Calendario__encabezado_dia">Ma</div>
          <div className="Calendario__encabezado_dia">Mi</div>
          <div className="Calendario__encabezado_dia">Ju</div>
          <div className="Calendario__encabezado_dia">Vi</div>
          <div className="Calendario__encabezado_dia">Sá</div>
          <div className="Calendario__encabezado_dia">Do</div>
        </div>
        <div className="Calendario__contenedor_dias">
          {fechas.map((f, i) => (
            <button
              className={classNames({
                "Calendario__boton_dia": true,
                "Calendario__boton_dia--hoy": isToday(f),
                "Calendario__boton_dia--seleccionado": isSameDay(f, fechaSeleccionada),
                "Calendario__boton_dia--otro-mes": !isSameMonth(mes, f),
                "Calendario__boton_dia--feriado": isSunday(f)
              })}
              key={`boton-calendario-${i}`}
              onClick={() => {
                seleccionarFecha(f)
                ocultar()
              }}
              disabled={isFuture(f)}
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