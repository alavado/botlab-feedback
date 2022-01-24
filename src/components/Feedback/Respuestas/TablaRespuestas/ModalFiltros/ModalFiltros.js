import React, { useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import './ModalFiltros.css'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { agregaFiltro, ordenaRespuestas } from '../../../../../redux/ducks/respuestas'
import iconoLimpiarFiltro from '@iconify/icons-mdi/close'
import iconoOrden from '@iconify/icons-mdi/sort'
import iconoOrdenDescendente from '@iconify/icons-mdi/sort-ascending'
import iconoOrdenAcendente from '@iconify/icons-mdi/sort-descending'
import iconoCheckboxActivo from '@iconify/icons-mdi/checkbox-marked'
import iconoCheckboxInactivo from '@iconify/icons-mdi/checkbox-blank-outline'
import iconoFiltro from '@iconify/icons-mdi/filter'
import { InlineIcon } from '@iconify/react'
import { ESQUEMA_OSCURO } from '../../../../../redux/ducks/opciones'
import { useMemo } from 'react'

const ModalFiltros = ({ i, header, activo, containerClass, esconder }) => {

  const [ancho, setAncho] = useState(0)
  const { filtros, ordenHeader, orden, categorias } = useSelector(state => state.respuestas)
  const { esquema } = useSelector(state => state.opciones)
  const { idEncuestaSeleccionada } = useSelector(state => state.encuestas)
  const filtroRef = useRef()
  const dispatch = useDispatch()
  const filtro = filtros.find(f => f.headers.length === 1 && f.headers[0] === header.nombre)
  const container = i >= 0 && document.getElementsByClassName(containerClass)[i]
  const { left, top, width } = useMemo(() => (container && container.getBoundingClientRect()) || { left: 0, top: 0, width: 0 }, [container])

  useEffect(() => setAncho(document.getElementsByClassName('ModalFiltros')[0]?.clientWidth), [filtro])
  useEffect(() => {
    if (activo) {
      filtroRef.current.value = filtro?.busqueda || ''
      filtroRef.current.focus()
    }
  }, [filtro, activo])
  const anchoTotal = left + width + ancho

  const ordenarRespuestas = () => dispatch(ordenaRespuestas({ header: header.nombre, idEncuesta: idEncuestaSeleccionada } ))

  if (!header) {
    return null
  }

  const nivelesHeader = categorias.find(c => c.propiedad === header.nombre)?.niveles || []

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
          className={classNames({
            "ModalFiltros": true,
            "ModalFiltros__oscuro": esquema === ESQUEMA_OSCURO
          })}
          style={{
            left: anchoTotal >= window.innerWidth ? `${left - ancho}px` : `${(left + width)}px`,
            top
          }}
          onClick={e => e.stopPropagation()}
        >
          <p className="ModalFiltros__titulo">Herramientas para columna</p>
          <button
            className="ModalFiltros__boton"
            onClick={ordenarRespuestas}
          >
            <InlineIcon icon={
              header.nombre === ordenHeader
                ? (orden === 'ASC' ? iconoOrdenAcendente : iconoOrdenDescendente)
                : iconoOrden
            } />
            {header.nombre === ordenHeader
              ? (orden === 'ASC' ? 'Orden ascendente' : 'Orden descendente')
              : 'Ordenar'
            }
          </button>
          {false && nivelesHeader.length > 0 && nivelesHeader.length < 30 && (
            <div className="ModalFiltros__contenedor_niveles">
              {nivelesHeader.map((nivel, i) => (
                <div
                  key={`contenedor-filtro-categoria-${i}`}
                  className="ModalFiltros__contenedor_checkbox_nivel"
                >
                  <button
                    className="ModalFiltros__checkbox_nivel"
                    onClick={() => dispatch(agregaFiltro({
                      busqueda: nivel,
                      nombreHeader: header.nombre,
                      textoHeader: header.texto,
                      idEncuesta: idEncuestaSeleccionada
                    }))}
                  >
                    <InlineIcon icon={iconoCheckboxInactivo} /> {nivel || '(Vacío)'}
                  </button>
                </div>
              ))}
            </div>
          )}
          <button
            className="ModalFiltros__boton"
            onClick={() => filtroRef.current.focus()}
          >
            <InlineIcon icon={iconoFiltro} />
            <input
              className="ModalFiltros__input_filtro"
              ref={filtroRef}
              onChange={e => dispatch(agregaFiltro({
                busqueda: e.target.value,
                nombreHeader: header.nombre,
                textoHeader: header.texto,
                idEncuesta: idEncuestaSeleccionada
              }))}
              placeholder="Escribe para filtrar"
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === 'Escape') {
                  esconder()
                }
              }}
            />
          </button>
          <button
            className="ModalFiltros__boton_limpiar_filtro"
            onClick={() => dispatch(agregaFiltro({
              busqueda: '',
              nombreHeader: header.nombre,
              textoHeader: header.texto,
              idEncuesta: idEncuestaSeleccionada
            }))}
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
