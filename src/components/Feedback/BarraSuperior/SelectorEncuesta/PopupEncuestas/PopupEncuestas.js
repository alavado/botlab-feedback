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

  return ReactDOM.createPortal(
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
      <div className="PopupEncuestas">
        {tiposOrdenados.map(({ id, nombre }) => (
          <div
            key={`boton-${id}`}
            onClick={() => verEncuesta(id)}
            className="PopupEncuestas__opcion"
          >
            <Icon className="PopupEncuestas__icono_empresa" icon={whatsapp} />
            <div className="PopupEncuestas__nombre_encuesta">
              {nombre}
            </div>
          </div>
        ))}
      </div>
    </div>, document.getElementById('popup-encuestas'))
}

export default PopupEncuestas
