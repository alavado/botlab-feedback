import React, { useMemo } from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import './PopupRangosFechas.css'
import { useDispatch } from 'react-redux'
import { guardaRangoFechas } from '../../../../../redux/ducks/respuestas'
import { endOfDay, startOfDay, startOfToday, startOfYesterday, sub } from 'date-fns'
import endOfYesterday from 'date-fns/endOfYesterday'

const PopupRangosFechas = ({ activo, esconder, rango }) => {

  const dispatch = useDispatch()
  const opciones = useMemo(() => (rango
    ? [
        {
          texto: 'Hoy',
          accion: () => {
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
            dispatch(
              guardaRangoFechas([
                startOfDay(sub(Date.now(), { days: 7 })),
                endOfDay(sub(Date.now(), { days: 7 })),
              ]))
            esconder()
          }
        },
      ]
  ), [dispatch, esconder, rango])

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
