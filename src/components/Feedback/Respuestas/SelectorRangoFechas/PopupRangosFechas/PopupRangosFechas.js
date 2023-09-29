import React, { useMemo } from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import './PopupRangosFechas.css'
import { useDispatch } from 'react-redux'
import { guardaRangoFechas } from '../../../../../redux/ducks/respuestas'
import { endOfDay, startOfDay, startOfToday, startOfYesterday, sub } from 'date-fns'
import endOfYesterday from 'date-fns/endOfYesterday'
import useAnalytics from '../../../../../hooks/useAnalytics'

const PopupRangosFechas = ({ activo, esconder, rango }) => {

  const dispatch = useDispatch()
  const track = useAnalytics()

  const opciones = useMemo(() => (rango
    ? [
        {
          texto: 'Hoy',
          accion: () => {
            track('Feedback', 'Respuestas', 'seleccionarRangoFecha', { rango: 'hoy' })
            dispatch(
              guardaRangoFechas([
                startOfToday(),
                Date.now()
              ]))
            esconder()
          }
        },
        {
          texto: 'Última semana',
          accion: () => {
            track('Feedback', 'Respuestas', 'seleccionarRangoFecha', { rango: 'última semana' })
            dispatch(
              guardaRangoFechas([
                startOfDay(sub(Date.now(), { days: 7 })),
                Date.now()
              ]))
            esconder()
          }
        },
        {
          texto: 'Ultimo mes',
          accion: () => {
            track('Feedback', 'Respuestas', 'seleccionarRangoFecha', { rango: 'último mes' })
            dispatch(
              guardaRangoFechas([
                startOfDay(sub(Date.now(), { months: 1 })),
                Date.now()
              ]))
            esconder()
          }
        },
      ]
    : [
        {
          texto: 'Hoy',
          accion: () => {
            track('Feedback', 'Respuestas', 'seleccionarRangoFecha', { rango: 'hoy' })
            dispatch(
              guardaRangoFechas([
                startOfToday(),
                Date.now()
              ]))
            esconder()
          }
        },
        {
          texto: 'Ayer',
          accion: () => {
            track('Feedback', 'Respuestas', 'seleccionarRangoFecha', { rango: 'ayer' })
            dispatch(
              guardaRangoFechas([
                startOfYesterday(),
                endOfYesterday()
              ]))
            esconder()
          }
        },
        {
          texto: 'Hace 7 días',
          accion: () => {
            track('Feedback', 'Respuestas', 'seleccionarRangoFecha', { rango: 'hace 7 días' })
            dispatch(
              guardaRangoFechas([
                startOfDay(sub(Date.now(), { days: 7 })),
                endOfDay(sub(Date.now(), { days: 7 })),
              ]))
            esconder()
          }
        },
      ]
  ), [dispatch, esconder, rango, track])

  return (
    <>
      {
        ReactDOM.createPortal(<div
          className="PopupRangosFechas__lamina"
          style={{ pointerEvents: activo ? 'all' : 'none' }}
          onClick={esconder}
        >
        </div>, document.getElementById('popup-rangos-fechas'))
      }
      <div className={classNames({
        PopupRangosFechas: true,
        'PopupRangosFechas--activo': activo
      })}>
        {opciones.map(({ texto, accion }, i) => (
          <div
            key={`opcion-rangos-${i}`}
            className="PopupRangosFecha__opcion"
            onClick={accion}
          >
            {texto}
          </div>
        ))}
      </div>
    </>
  )
}

export default PopupRangosFechas
