import React, { useCallback, useEffect, useState } from 'react'
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
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import classNames from 'classnames'
import { differenceInMinutes } from 'date-fns'

registerLocale('es', es)

const SelectorRangoFechas = () => {

  const { fechaInicio, fechaTermino, cacheInvalido, fechaActualizacion } = useSelector(state => state.respuestas)
  const [popupActivo, setPopupActivo] = useState(false)
  const [fechaActual, setFechaActual] = useState('')
  const esconder = useCallback(() => setPopupActivo(false), [setPopupActivo])
  const dispatch = useDispatch()

  useEffect(() => {
    const actualizarFecha = () => setFechaActual(() => Date.now())
    actualizarFecha()
    const intervalFecha = setInterval(actualizarFecha, 1000)
    return () => clearInterval(intervalFecha)
  }, [])

  const alertar = differenceInMinutes(fechaActual, fechaActualizacion) >= 5
  const mensajeActualizacion = `actualizado ${formatDistanceToNow(fechaActualizacion, { locale: es, addSuffix: true })}`

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
        className={classNames({
          "SelectorRangoFechas__boton": true,
          "SelectorRangoFechas__boton--alerta": alertar,
        })}
        title={`Actualizar (${mensajeActualizacion})`}
        onClick={() => dispatch(actualizaRespuestas())}
        disabled={cacheInvalido}
      >
        <Icon className="SelectorRangoFechas__boton_icono" icon={iconoRecargar} />
      </button>
    </div>
  )
}

export default SelectorRangoFechas
