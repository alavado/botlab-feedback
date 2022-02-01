import React, { useEffect, useRef } from 'react'
import ReactDOM from 'react-dom'
import classNames from 'classnames'
import './ModalFiltros.css'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { agregaFiltro, ordenaRespuestas, remueveFiltro } from '../../../../../redux/ducks/respuestas'
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
import TagRespuesta from '../TagRespuesta'
import diccionarioTags from "../../../../../helpers/tags"

const ModalFiltros = ({ i, header, activo, containerClass, esconder }) => {

  const [ancho, setAncho] = useState(0)
  const { filtros, ordenHeader, orden, categorias } = useSelector(state => state.respuestas)
  const { esquema } = useSelector(state => state.opciones)
  const { idEncuestaSeleccionada } = useSelector(state => state.encuestas)
  const filtroRef = useRef()
  const dispatch = useDispatch()
  const indiceFiltro = filtros.findIndex(f => f.headers[0] === header.nombre)
  const filtro = indiceFiltro >= 0 && filtros[indiceFiltro]
  const container = i >= 0 && document.getElementsByClassName(containerClass)[i]
  const { left, top, width } = useMemo(() => (container && container.getBoundingClientRect()) || { left: 0, top: 0, width: 0 }, [container, i])

  useEffect(() => setAncho(document.getElementsByClassName('ModalFiltros')[0]?.clientWidth), [filtro])
  useEffect(() => {
    if (activo) {
      filtroRef.current.value = (filtro?.busqueda?.length === 1 && filtro.busqueda[0]) || ''
      filtroRef.current.focus()
    }
  }, [filtro, activo])
  const anchoTotal = left + width + ancho

  const ordenarRespuestas = () => dispatch(ordenaRespuestas({ header: header.nombre, idEncuesta: idEncuestaSeleccionada } ))

  if (!header) {
    return null
  }

  const categoria = categorias.find(c => c.propiedad === header.nombre)
  const nivelesHeader = categoria?.niveles.filter(x => categoria.esTag || x) || []

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
          {nivelesHeader.length > 0 && nivelesHeader.length < 50 && (
            <div className="ModalFiltros__contenedor_niveles">
              <div className="ModalFiltros__contenedor_checkbox_nivel">
                <button
                  className="ModalFiltros__checkbox_nivel"
                  onClick={() => dispatch(remueveFiltro(indiceFiltro))}
                >
                  <InlineIcon icon={filtro ? iconoCheckboxInactivo : iconoCheckboxActivo} className="ModalFiltros__icono_checkbox_nivel" /> Mostrar todo
                </button>
              </div>
              {nivelesHeader.map((nivel, i) => (
                <div
                  key={`contenedor-filtro-categoria-${i}`}
                  className="ModalFiltros__contenedor_checkbox_nivel"
                >
                  <button
                    className="ModalFiltros__checkbox_nivel"
                    onClick={() => dispatch(agregaFiltro({
                      busqueda: categoria.esTag ? diccionarioTags(nivel).texto : nivel,
                      nombreHeader: header.nombre,
                      textoHeader: header.texto,
                      idEncuesta: idEncuestaSeleccionada,
                      opciones: {
                        mismaColumna: true
                      }
                    }))}
                  >
                    {categoria.esTag
                      ? <>
                          <InlineIcon icon={filtro?.busqueda?.includes(diccionarioTags(nivel).texto) ? iconoCheckboxActivo : iconoCheckboxInactivo} className="ModalFiltros__icono_checkbox_nivel" />
                          <TagRespuesta tag={nivel} pregunta={diccionarioTags(nivel).texto} incluirSinRespuesta={true} />
                        </>
                      : <>
                          <InlineIcon icon={filtro?.busqueda?.includes(nivel) ? iconoCheckboxActivo : iconoCheckboxInactivo} className="ModalFiltros__icono_checkbox_nivel" /> <>{nivel || '(Vacío)'}</>
                        </>
                    }
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
