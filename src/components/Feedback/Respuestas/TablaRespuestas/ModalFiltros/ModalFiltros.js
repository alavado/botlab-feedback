import React, { useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import './ModalFiltros.css'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { agregaFiltro } from '../../../../../redux/ducks/respuestas'

const ModalFiltros = ({ i, activo, containerClass, esconder }) => {

  const [ancho, setAncho] = useState(0)
  const { filtros } = useSelector(state => state.respuestas)
  const filtro = filtros.filter(f => f.headers?.indexOf(i) >= 0)[0]
  const container = i >= 0 && document.getElementsByClassName(containerClass)[i]
  const { left, top, width } = (container && container.getBoundingClientRect()) || { left: 0, top: 0, width: 0 }
  
  const filtroRef = useRef()
  const dispatch = useDispatch()
  useEffect(() => setAncho(document.getElementsByClassName('ModalFiltros')[0].clientWidth), [])
  useEffect(() => {
    if (activo) {
      filtroRef.current.value = filtro?.busqueda || ''
      filtroRef.current.focus()
    }
  }, [filtro, activo])
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
            left: anchoTotal >= window.innerWidth ? `${left - ancho}px` : (left + width),
            top
          }}
          onClick={e => e.stopPropagation()}
        >
          <input
            ref={filtroRef}
            onChange={e => dispatch(agregaFiltro([i, e.target.value]))}
          />
        </div>
      </div>
    , document.getElementById('modal-filtros'))
  )
}

export default ModalFiltros
