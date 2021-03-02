import React, { useMemo } from 'react'
import ReactDOM from 'react-dom'
import { useSelector } from 'react-redux'
import { Icon } from '@iconify/react'
import whatsapp from '@iconify/icons-mdi/whatsapp'
import classNames from 'classnames'
import './PopupEncuestas.css'

const PopupEncuestas = ({ activo, esconder, verEncuesta }) => {

  const { tipos, idEncuestaSeleccionada } = useSelector(state => state.encuestas)

  const tiposOrdenados = useMemo(() => {
    const indiceEncuestaSeleccionada = tipos.findIndex(({ id }) => id === idEncuestaSeleccionada)
    return [
      tipos[indiceEncuestaSeleccionada],
      ...tipos.filter(({ id }) => id !== idEncuestaSeleccionada)
    ]
  }, [tipos, idEncuestaSeleccionada])

  return <>
      {ReactDOM.createPortal(
      <div
        className={classNames({
          'PopupEncuestas__lamina': true,
          'PopupEncuestas__lamina--activo': activo
        })}
        style={{ pointerEvents: activo ? 'all' : 'none' }}
        onClick={e => {
          esconder()
          e.stopPropagation()
        }}
      >
      </div>, document.getElementById('popup-encuestas'))}
      <div
        className="PopupEncuestas" 
        style={{
          pointerEvents:activo ? 'all' : 'none',
          opacity: activo ? 1 : 0
        }}
      >
        {tiposOrdenados.map(({ id, nombre }) => (
          <div
            key={`boton-${id}`}
            onClick={e => {
              verEncuesta(id)
              esconder()
              e.stopPropagation()
            }}
            className="PopupEncuestas__opcion"
          >
            <Icon className="PopupEncuestas__icono_empresa" icon={whatsapp} />
            <div className="PopupEncuestas__nombre_encuesta">
              {nombre}
            </div>
          </div>
        ))}
      </div>
    </>
}

export default PopupEncuestas
