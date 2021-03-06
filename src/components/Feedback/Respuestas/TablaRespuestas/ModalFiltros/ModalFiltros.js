import React, { useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import './ModalFiltros.css'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { agregaFiltro, ordenaRespuestas } from '../../../../../redux/ducks/respuestas'
import iconoLimpiarFiltro from '@iconify/icons-mdi/close'
import iconoOrdenDescendente from '@iconify/icons-mdi/sort-ascending'
import iconoFiltro from '@iconify/icons-mdi/filter'
import { InlineIcon } from '@iconify/react'

const ModalFiltros = ({ i, header, activo, containerClass, esconder }) => {

  const [ancho, setAncho] = useState(0)
  const { filtros } = useSelector(state => state.respuestas)
  const filtroRef = useRef()
  const dispatch = useDispatch()
  const filtro = filtros.find(f => f.headers.length === 1 && f.headers[0] === header.nombre)
  const container = i >= 0 && document.getElementsByClassName(containerClass)[i]
  const { left, top, width } = (container && container.getBoundingClientRect()) || { left: 0, top: 0, width: 0 }

  useEffect(() => setAncho(document.getElementsByClassName('ModalFiltros')[0].clientWidth), [filtro])
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
          <button
            className="ModalFiltros__boton"
            onClick={() => dispatch(ordenaRespuestas(header.nombre))}
          >
            <InlineIcon icon={iconoOrdenDescendente} /> Ordenar
          </button>
          <button
            className="ModalFiltros__boton"
            onClick={() => filtroRef.current.focus()}
          >
            <InlineIcon icon={iconoFiltro} />
            <input
              className="ModalFiltros__input_filtro"
              ref={filtroRef}
              onChange={e => dispatch(agregaFiltro([e.target.value, header.nombre, header.texto]))}
              placeholder="Filtrar"
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === 'Escape') {
                  esconder()
                }
              }}
            />
          </button>
          <button
            className="ModalFiltros__boton_limpiar_filtro"
            onClick={() => dispatch(agregaFiltro(['', header.nombre, header.texto]))}
            title="Limpiar filtro"
          >
            <InlineIcon icon={iconoLimpiarFiltro} />
          </button>
        </div>
      </div>
    , document.getElementById('modal-filtros'))
  )
}

export default ModalFiltros
