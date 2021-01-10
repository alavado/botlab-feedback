import React, { useEffect } from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import './ModalFiltros.css'
import { useState } from 'react'

const ModalFiltros = ({ i, activo, containerClass, esconder }) => {

  const [ancho, setAncho] = useState(0)
  const container = i >= 0 && document.getElementsByClassName(containerClass)[i]
  const { left, top, width } = (container && container.getBoundingClientRect()) || { left: 0, top: 0, width: 0 }
  
  useEffect(() => setAncho(document.getElementsByClassName('ModalFiltros')[0].clientWidth), [])
  const anchoTotal = left + width + ancho + 25

  return (
    ReactDOM.createPortal(
      <div
        className={classNames({
          "ModalFiltros__lamina": true,
          'ModalFiltros__lamina--oculta': !activo
        })}
        onClick={esconder}
      >
        <div
          className="ModalFiltros"
          style={{
            left: anchoTotal >= window.innerWidth ? `calc(${left}px - 10rem)` : (left + width),
            top
          }}
          onClick={e => e.stopPropagation()}
        >
          xx
        </div>
      </div>
    , document.getElementById('modal-filtros'))
  )
}

export default ModalFiltros
