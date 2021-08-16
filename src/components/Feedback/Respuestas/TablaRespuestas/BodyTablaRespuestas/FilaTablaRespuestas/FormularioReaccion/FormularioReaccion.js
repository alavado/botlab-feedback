import React, { useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import './FormularioReaccion.css'

const FormularioReaccion = ({ ocultar, visible, left, top, emoticon, setEmoticon }) => {

  const refInputComentario = useRef()

  useEffect(() => {
    if (visible && !emoticon) {
      setEmoticon('✅')
    }
  }, [visible])

  useEffect(() => {
    if (visible) {
      refInputComentario.current.focus()
    }
  }, [visible])

  return ReactDOM.createPortal(
      <div
        className={classNames({
          "FormularioReaccion": true,
          "FormularioReaccion--visible": visible
        })}
        style={{
          left: `calc(${left || 0}px - 2 * var(--margen-transparente-formulario-reaccion) + .25rem)`,
          top: `calc(${top || 0}px - var(--alto-formulario-reaccion) + var(--margen-transparente-formulario-reaccion) - var(--alto-cachito-reaccion) - .25rem)`
        }}
        // onMouseLeave={() => visible && ocultar()}
        onClick={e => e.stopPropagation()}
      >
        <div className="FormularioReaccion__contenedor">
          <form onSubmit={e => {e.preventDefault(); ocultar()}} className="FormularioReaccion__formulario">
            <div>{emoticon}</div>
            <input
              type="text"
              maxLength={100}
              placeholder="Comentario"
              className="FormularioReaccion__input_comentario"
              ref={refInputComentario}
            />
            {/* <button type="submit">Agregar</button>
            <button type="submit">Cancelar</button> */}
          </form>
          <button onClick={ocultar}>x</button>
        </div>
      </div>,
  document.getElementById('modal-emojis'))
}

export default FormularioReaccion