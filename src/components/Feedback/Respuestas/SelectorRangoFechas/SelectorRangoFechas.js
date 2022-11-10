import { useCallback, useEffect, useState } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import ReactDatePicker, { registerLocale as reactDatePickerRegisterLocale } from 'react-datepicker'
import es from 'date-fns/locale/es'
import { useDispatch, useSelector } from 'react-redux'
import { actualizaRespuestas, guardaFechaInicio, guardaFechaTermino, guardaRangoFechas } from '../../../../redux/ducks/respuestas'
import { Icon, InlineIcon } from '@iconify/react'
import './SelectorRangoFechas.css'
import './react-datepicker-overrides.css'
import PopupRangosFechas from './PopupRangosFechas'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import classNames from 'classnames'
import { differenceInMinutes } from 'date-fns'
import PopupTipoSeleccion from './PopupTipoSeleccion'
import useAnalytics from '../../../../hooks/useAnalytics'

reactDatePickerRegisterLocale('es', es)

const SelectorRangoFechas = () => {

  const { fechaInicio, fechaTermino, cacheInvalido, fechaActualizacion } = useSelector(state => state.respuestas)
  const { seleccionarRangoFechas } = useSelector(state => state.opciones)
  const { cuenta } = useSelector(state => state.login)
  const [popupRangosComunesActivo, setPopupRangosComunesActivo] = useState(false)
  const [popupTipoSeleccionActivo, setPopupTipoSeleccionActivo] = useState(false)
  const [fechaActual, setFechaActual] = useState(Date.now())
  const esconderPopupRangosComunes = useCallback(() => setPopupRangosComunesActivo(false), [setPopupRangosComunesActivo])
  const esconderPopupTipoSeleccionActivo = useCallback(() => setPopupTipoSeleccionActivo(false), [setPopupTipoSeleccionActivo])
  const dispatch = useDispatch()
  const track = useAnalytics()

  useEffect(() => {
    const intervalFecha = setInterval(() => setFechaActual(() => Date.now()), 10_000)
    return () => clearInterval(intervalFecha)
  }, [])

  const alertar = differenceInMinutes(fechaActual, fechaActualizacion) >= 5
  const mensajeActualizacion = `actualizado ${formatDistanceToNow(fechaActualizacion, { locale: es, addSuffix: true })}`

  const actualizar = () => {
    track('Feedback', 'Respuestas', 'actualizar')
    dispatch(actualizaRespuestas())
  }

  return (
    <div className="SelectorRangoFechas">
    <button
      className="SelectorRangoFechas__boton SelectorRangoFechas__boton--rango"
      onClick={() => setPopupTipoSeleccionActivo(true)}
      tooltip="Tipo de selección"
    >
      {seleccionarRangoFechas ? 'Rango' : 'Fecha'} <InlineIcon icon="mdi:chevron-down" />
    </button>
      {seleccionarRangoFechas
        ? <>
            <ReactDatePicker
              selected={fechaInicio}
              onChange={f => {
                track('Feedback', 'Respuestas', 'cambiarFechaInicial', { fecha: f })
                dispatch(guardaFechaInicio(f))
              }}
              onCalendarOpen={() => track('Feedback', 'Respuestas', 'abrirCalendario', { posicion: 'inicio' })}
              onClickOutside={() => track('Feedback', 'Respuestas', 'cerrarCalendario', { posicion: 'inicio' })}
              maxDate={fechaTermino}
              dateFormat="d MMMM yyyy"
              locale="es"
              className="SelectorRangoFechas__datepicker"
            />
            -
            <ReactDatePicker
              selected={fechaTermino}
              onChange={f => {
                track('Feedback', 'Respuestas', 'cambiarFechaFinal', { fecha: f })
                dispatch(guardaFechaTermino(f))
              }}
              onCalendarOpen={() => track('Feedback', 'Respuestas', 'abrirCalendario', { posicion: 'fin' })}
              onClickOutside={() => track('Feedback', 'Respuestas', 'cerrarCalendario', { posicion: 'fin' })}
              dateFormat="d MMMM yyyy"
              locale="es"
              className="SelectorRangoFechas__datepicker"
              maxDate={Date.now()}
            />
          </>
        : <>
            <ReactDatePicker
              selected={fechaInicio}
              onChange={f => {
                track('Feedback', 'Respuestas', 'cambiarFechaEspecifica', { fecha: f })
                dispatch(guardaRangoFechas([f, f]))
              }}
              onCalendarOpen={() => track('Feedback', 'Respuestas', 'abrirCalendario', { posicion: 'unica' })}
              onClickOutside={() => track('Feedback', 'Respuestas', 'cerrarCalendario', { posicion: 'unica' })}
              dateFormat="iiii d MMMM yyyy"
              locale="es"
              className="SelectorRangoFechas__datepicker SelectorRangoFechas__datepicker--ancho"
              maxDate={Date.now()}
            />
          </>
      }
      <button
        className="SelectorRangoFechas__boton"
        onClick={() => setPopupRangosComunesActivo(true)}
        tooltip="Rangos habituales"
      >
        <Icon className="SelectorRangoFechas__boton_icono" icon="mdi:dots-vertical" />
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
        onClick={actualizar}
        disabled={cacheInvalido}
      >
        <Icon className="SelectorRangoFechas__boton_icono" icon="mdi:refresh" />
      </button>
    </div>
  )
}

export default SelectorRangoFechas
