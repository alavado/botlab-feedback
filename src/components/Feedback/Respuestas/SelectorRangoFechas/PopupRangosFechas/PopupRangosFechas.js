import React, { useMemo } from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import './PopupRangosFechas.css'
import { useDispatch } from 'react-redux'
import { guardaRangoFechas } from '../../../../../redux/ducks/respuestas'
import { startOfDay, startOfToday, sub } from 'date-fns'

const PopupRangosFechas = ({ activo, esconder }) => {

  const dispatch = useDispatch()
  const opciones = useMemo(() => [
    {
      texto: 'Hoy',
      accion: () => {
        dispatch(
          guardaRangoFechas(
            startOfToday(),
            Date.now()
          ))
        esconder()
      }
    },
    {
      texto: 'Última semana',
      accion: () => {
        dispatch(
          guardaRangoFechas(
            startOfDay(sub(Date.now(), { days: 7 })),
            Date.now()
          ))
        esconder()
      }
    },
    {
      texto: 'Ultimo mes',
      accion: () => {
        dispatch(
          guardaRangoFechas(
            startOfDay(sub(Date.now(), { months: 1 })),
            Date.now()
          ))
        esconder()
      }
    }
  ], [dispatch, esconder])

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
