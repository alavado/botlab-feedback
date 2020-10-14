import React from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import ReactDatePicker, { registerLocale } from 'react-datepicker'
import es from 'date-fns/locale/es'
import { useDispatch, useSelector } from 'react-redux'
import { guardaFechaInicio, guardaFechaTermino } from '../../../../redux/ducks/respuestas'
import './SelectorRangoFechas.css'

registerLocale('es', es)

const SelectorRangoFechas = () => {

  const { fechaInicio, fechaTermino } = useSelector(state => state.respuestas)
  const dispatch = useDispatch()

  return (
    <div className="SelectorRangoFechas">
      Período:
      <ReactDatePicker
        selected={fechaInicio}
        onChange={f => dispatch(guardaFechaInicio(f))}
        dateFormat="d MMMM yyyy"
        locale="es"
      />
      al
      <ReactDatePicker
        selected={fechaTermino}
        onChange={f => dispatch(guardaFechaTermino(f))}
        dateFormat="d MMMM yyyy"
        locale="es"
      />
    </div>
  )
}

export default SelectorRangoFechas
