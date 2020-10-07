import React from 'react'
import ReactDatePicker from 'react-datepicker'
import { useDispatch, useSelector } from 'react-redux'
import './SelectorRangoFechas.css'
import 'react-datepicker/dist/react-datepicker.css'
import { guardaFechaInicio, guardaFechaTermino } from '../../../redux/ducks/respuestas'

const SelectorRangoFechas = () => {

  const { fechaInicio, fechaTermino } = useSelector(state => state.respuestas)
  const dispatch = useDispatch()

  return (
    <div className="SelectorRangoFechas">
      <ReactDatePicker
        selected={fechaInicio}
        onChange={f => dispatch(guardaFechaInicio(f))}
      />
      <ReactDatePicker
        selected={fechaTermino}
        onChange={f => dispatch(guardaFechaTermino(f))}
      />
    </div>
  )
}

export default SelectorRangoFechas
