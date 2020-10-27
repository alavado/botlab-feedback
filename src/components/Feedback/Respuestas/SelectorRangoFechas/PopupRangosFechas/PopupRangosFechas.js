import React from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import './PopupRangosFechas.css'

const PopupRangosFechas = ({ activo, esconder }) => {
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
        <div className="PopupRangosFecha__opcion">
          Hoy
        </div>
        <div className="PopupRangosFecha__opcion">
          Última semana
        </div>
        <div className="PopupRangosFecha__opcion">
          Último mes
        </div>
      </div>
    </>
  )
}

export default PopupRangosFechas
