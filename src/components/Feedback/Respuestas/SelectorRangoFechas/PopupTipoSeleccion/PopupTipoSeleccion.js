import React, { useMemo } from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import './PopupTipoSeleccion.css'
import { useDispatch, useSelector } from 'react-redux'
import { fijaOpcionSeleccionarRangoFechas } from '../../../../../redux/ducks/opciones'
import { guardaRangoFechas } from '../../../../../redux/ducks/respuestas'

const PopupTipoSeleccion = ({ activo, esconder }) => {

  const dispatch = useDispatch()
  const { fechaInicio, fechaTermino } = useSelector(state => state.respuestas)
  const { seleccionarRangoFechas } = useSelector(state => state.opciones)
  const opciones = useMemo(() => (
    seleccionarRangoFechas
    ? [
        {
          texto: 'Rango',
          accion: () => {
            dispatch(fijaOpcionSeleccionarRangoFechas(true))
            if (fechaInicio !== fechaTermino) {
              dispatch(guardaRangoFechas([fechaInicio, fechaInicio]))
            }
            esconder()
          }
        },
        {
          texto: 'Fecha',
          accion: () => {
            dispatch(fijaOpcionSeleccionarRangoFechas(false))
            esconder()
          }
        },
      ]
    : [
        {
          texto: 'Fecha',
          accion: () => {
            dispatch(fijaOpcionSeleccionarRangoFechas(false))
            esconder()
          }
        },
        {
          texto: 'Rango',
          accion: () => {
            dispatch(fijaOpcionSeleccionarRangoFechas(true))
            if (fechaInicio !== fechaTermino) {
              dispatch(guardaRangoFechas([fechaInicio, fechaInicio]))
            }
            esconder()
          }
        },
      ]
  ), [dispatch, esconder, seleccionarRangoFechas])

  return (
    <>
      {
        ReactDOM.createPortal(<div
          className="PopupTipoSeleccion__lamina"
          style={{ pointerEvents: activo ? 'all' : 'none' }}
          onClick={esconder}
        >
        </div>, document.getElementById('popup-rangos-fechas'))
      }
      <div className={classNames({
        PopupTipoSeleccion: true,
        'PopupTipoSeleccion--activo': activo
      })}>
        {opciones.map(({ texto, accion }, i) => (
          <div
            key={`opcion-rangos-${i}`}
            className="PopupTipoSeleccion__opcion"
            onClick={accion}
          >
            {texto}
          </div>
        ))}
      </div>
    </>
  )
}

export default PopupTipoSeleccion
