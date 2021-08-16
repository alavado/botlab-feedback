import React from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import './FormularioReaccion.css'

const FormularioReaccion = ({ ocultar, visible, left, top }) => {

  return ReactDOM.createPortal(
      <div
        className={classNames({
          "FormularioReaccion": true,
          "FormularioReaccion--visible": visible
        })}
        style={{ left: `calc(${left || 0}px - var(--margen-transparente-formulario-reaccion))`, top: `calc(${top || 0}px - var(--alto-formulario-reaccion) + var(--margen-transparente-formulario-reaccion))` }}
        onMouseLeave={() => visible && ocultar()}
        onClick={e => e.stopPropagation()}
      >
        <div className="FormularioReaccion__contenedor">
        </div>
      </div>,
  document.getElementById('modal-emojis'))
}

export default FormularioReaccion