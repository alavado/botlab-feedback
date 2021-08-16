import React, { useMemo, useState } from 'react'
import classNames from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import './HeadTablaRespuestas.css'
import Icon, { InlineIcon } from '@iconify/react'
import triangulito from '@iconify/icons-mdi/arrow-down-drop'
import iconoNota from '@iconify/icons-mdi/note-edit'
import ModalFiltros from '../ModalFiltros'
import { destacaColumna, fijaColumna, yaNoDestaquesColumna } from '../../../../../redux/ducks/respuestas'
import { obtenerHeaders } from '../../../../../helpers/tablaRespuestas'

const HeadTablaRespuestas = () => {

  const { idEncuestaSeleccionada: idEncuesta, headers } = useSelector(state => state.encuestas)
  const [modalFiltroActivo, setModalFiltroActivo] = useState(false)
  const [indiceColumnaFiltrada, setIndiceColumnaFiltrada] = useState(0)
  const { columnaDestacada } = useSelector(state => state.respuestas)
  const dispatch = useDispatch()

  const headersOrdenados = useMemo(() => obtenerHeaders(headers, idEncuesta) || [], [headers, idEncuesta])

  const mostrarModalFiltros = indiceColumna => {
    setIndiceColumnaFiltrada(indiceColumna)
    setModalFiltroActivo(true)
    dispatch(fijaColumna(true))
  }

  return (
    <thead className="HeadTablaRespuestas">
      <tr className="HeadTablaRespuestas__fila">
        <th style={{ display: 'none' }} className="HeadTablaRespuestas__header--sin-padding"></th>
        {headersOrdenados.map(({ nombre, texto }, i) => (
          <th
            key={`header-${nombre}`}
            className={classNames({
              'HeadTablaRespuestas__header': true,
              'HeadTablaRespuestas__header--activo': modalFiltroActivo && i === indiceColumnaFiltrada,
              'HeadTablaRespuestas__header--destacado': columnaDestacada === i
            })}
            onClick={() => mostrarModalFiltros(i)}
            onMouseEnter={() => dispatch(destacaColumna(i))}
            onMouseLeave={() => dispatch(yaNoDestaquesColumna())}
            title={texto}
          >
            <div className="HeadTablaRespuestas__texto_header">
              {texto}
              <button className="HeaderTablaRespuestas__boton_filtros">
                <InlineIcon icon={triangulito} className="HeaderTablaRespuestas__icono_filtros" />
              </button>
              {/* {ordenHeader === nombre && orden === 'ASC' &&
                <InlineIcon icon={triangulito} className="HeaderTablaRespuestas__icono_orden" />
              }
              {ordenHeader === nombre && orden === 'DESC' &&
                <InlineIcon icon={triangulito} className="HeaderTablaRespuestas__icono_orden HeaderTablaRespuestas__icono_orden--girado" />
              } */}
            </div>
          </th>
        ))}
      </tr>
      <ModalFiltros
        i={indiceColumnaFiltrada}
        header={headersOrdenados[indiceColumnaFiltrada]}
        activo={modalFiltroActivo}
        containerClass="HeadTablaRespuestas__header"
        esconder={() => {
          setModalFiltroActivo(false)
          dispatch(fijaColumna(false))
        }}
      />
    </thead>
  )
}

export default HeadTablaRespuestas
