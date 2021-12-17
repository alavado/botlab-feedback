import React, { useCallback, useEffect, useState } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import ReactDatePicker, { registerLocale } from 'react-datepicker'
import es from 'date-fns/locale/es'
import { useDispatch, useSelector } from 'react-redux'
import { actualizaRespuestas, guardaFechaInicio, guardaFechaTermino, guardaRangoFechas } from '../../../../redux/ducks/respuestas'
import iconoOpciones from '@iconify/icons-mdi/dots-vertical'
import iconoRecargar from '@iconify/icons-mdi/refresh'
import chevronDown from '@iconify/icons-mdi/chevron-down'
import Icon, { InlineIcon } from '@iconify/react'
import './SelectorRangoFechas.css'
import './react-datepicker-overrides.css'
import PopupRangosFechas from './PopupRangosFechas'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import classNames from 'classnames'
import { differenceInMinutes } from 'date-fns'
import { cambiaOpcionSeleccionarRangoFechas } from '../../../../redux/ducks/opciones'
import PopupTipoSeleccion from './PopupTipoSeleccion'

registerLocale('es', es)

const SelectorRangoFechas = () => {

  const { fechaInicio, fechaTermino, cacheInvalido, fechaActualizacion } = useSelector(state => state.respuestas)
  const { seleccionarRangoFechas } = useSelector(state => state.opciones)
  const [popupRangosComunesActivo, setPopupRangosComunesActivo] = useState(false)
  const [popupTipoSeleccionActivo, setPopupTipoSeleccionActivo] = useState(false)
  const [fechaActual, setFechaActual] = useState('')
  const esconderPopupRangosComunes = useCallback(() => setPopupRangosComunesActivo(false), [setPopupRangosComunesActivo])
  const esconderPopupTipoSeleccionActivo = useCallback(() => setPopupTipoSeleccionActivo(false), [setPopupTipoSeleccionActivo])
  const dispatch = useDispatch()

  useEffect(() => {
    const intervalFecha = setInterval(() => setFechaActual(() => Date.now()), 1000)
    return () => clearInterval(intervalFecha)
  }, [])

  const alertar = differenceInMinutes(fechaActual, fechaActualizacion) >= 5
  const mensajeActualizacion = `actualizado ${formatDistanceToNow(fechaActualizacion, { locale: es, addSuffix: true })}`

  return (
    <div className="SelectorRangoFechas">
    <button
      className="SelectorRangoFechas__boton SelectorRangoFechas__boton--rango"
      onClick={() => setPopupTipoSeleccionActivo(true)}
      tooltip="Cambiar tipo de selección"
    >
      {seleccionarRangoFechas ? 'Rango' : 'Fecha'} <InlineIcon icon={chevronDown} />
    </button>
      {
        seleccionarRangoFechas
        ? <>
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
          </>
        : <>
            <ReactDatePicker
              selected={fechaInicio}
              onChange={f => dispatch(guardaRangoFechas([f, f]))}
              dateFormat="iiii d MMMM yyyy"
              locale="es"
              className="SelectorRangoFechas__datepicker SelectorRangoFechas__datepicker--ancho"
            />
          </>
      }
      <button
        className="SelectorRangoFechas__boton"
        onClick={() => setPopupRangosComunesActivo(true)}
        tooltip="Rangos habituales"
      >
        <Icon className="SelectorRangoFechas__boton_icono" icon={iconoOpciones} />
      </button>
      <PopupRangosFechas
        activo={popupRangosComunesActivo}
        esconder={esconderPopupRangosComunes}
        rango={seleccionarRangoFechas}
      />
      <PopupTipoSeleccion
        activo={popupTipoSeleccionActivo}
        esconder={esconderPopupTipoSeleccionActivo}
      />
      <button
        className={classNames({
          "SelectorRangoFechas__boton": true,
          "SelectorRangoFechas__boton--alerta": alertar,
        })}
        tooltip={`Actualizar (${mensajeActualizacion})`}
        onClick={() => dispatch(actualizaRespuestas())}
        disabled={cacheInvalido}
      >
        <Icon className="SelectorRangoFechas__boton_icono" icon={iconoRecargar} />
      </button>
    </div>
  )
}

export default SelectorRangoFechas
