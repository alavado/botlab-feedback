import React, { useCallback, useState } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import ReactDatePicker, { registerLocale } from 'react-datepicker'
import es from 'date-fns/locale/es'
import { useDispatch, useSelector } from 'react-redux'
import { actualizaRespuestas, guardaFechaInicio, guardaFechaTermino } from '../../../../redux/ducks/respuestas'
import iconoOpciones from '@iconify/icons-mdi/dots-vertical'
import iconoRecargar from '@iconify/icons-mdi/refresh'
import Icon from '@iconify/react'
import './SelectorRangoFechas.css'
import './react-datepicker-overrides.css'
import PopupRangosFechas from './PopupRangosFechas'

registerLocale('es', es)

const SelectorRangoFechas = () => {

  const { fechaInicio, fechaTermino, cacheInvalido } = useSelector(state => state.respuestas)
  const [popupActivo, setPopupActivo] = useState(false)
  const dispatch = useDispatch()
  const esconder = useCallback(() => setPopupActivo(false), [setPopupActivo])

  return (
    <div className="SelectorRangoFechas">
      Rango:
      <ReactDatePicker
        selected={fechaInicio}
        onChange={f => dispatch(guardaFechaInicio(f))}
        maxDate={fechaTermino}
        dateFormat="d MMMM yyyy"
        locale="es"
        className="SelectorRangoFechas__datepicker"
      />
      -
      <ReactDatePicker
        selected={fechaTermino}
        onChange={f => dispatch(guardaFechaTermino(f))}
        dateFormat="d MMMM yyyy"
        locale="es"
        className="SelectorRangoFechas__datepicker"
      />
      <button
        className="SelectorRangoFechas__boton"
        onClick={() => setPopupActivo(true)}
        title="Rangos habituales"
      >
        <Icon className="SelectorRangoFechas__boton_icono" icon={iconoOpciones} />
      </button>
      <PopupRangosFechas
        activo={popupActivo}
        esconder={esconder}
      />
      <button
        className="SelectorRangoFechas__boton"
        title="Refrescar datos"
        onClick={() => dispatch(actualizaRespuestas())}
        disabled={cacheInvalido}
      >
        <Icon className="SelectorRangoFechas__boton_icono" icon={iconoRecargar} />
      </button>
    </div>
  )
}

export default SelectorRangoFechas
