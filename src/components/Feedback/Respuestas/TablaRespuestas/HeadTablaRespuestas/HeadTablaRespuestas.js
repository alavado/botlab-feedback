import { useMemo, useState } from 'react'
import classNames from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import './HeadTablaRespuestas.css'
import { InlineIcon } from '@iconify/react'
import ModalFiltros from '../ModalFiltros'
import {
  destacaColumna,
  fijaColumna,
  yaNoDestaquesColumna,
} from '../../../../../redux/ducks/respuestas'
import { obtenerHeaders } from '../../../../../helpers/tablaRespuestas'

const parchar = (texto) => {
  if (texto.includes('_PAPERInsTypeDR')) {
    return texto.replace('_PAPERInsTypeDR', 'Previsión')
  }
  return texto
}

const HeadTablaRespuestas = () => {
  const { idEncuestaSeleccionada: idEncuesta, headers } = useSelector(
    (state) => state.encuestas
  )
  const [modalFiltroActivo, setModalFiltroActivo] = useState(false)
  const [indiceColumnaFiltrada, setIndiceColumnaFiltrada] = useState(0)
  const { columnaDestacada, ordenHeader, orden } = useSelector(
    (state) => state.respuestas
  )
  const dispatch = useDispatch()

  const headersOrdenados = useMemo(
    () => obtenerHeaders(headers, idEncuesta) || [],
    [headers, idEncuesta]
  )

  const mostrarModalFiltros = (indiceColumna) => {
    setIndiceColumnaFiltrada(indiceColumna)
    setModalFiltroActivo(true)
    dispatch(fijaColumna(true))
  }

  return (
    <thead className="HeadTablaRespuestas">
      <tr className="HeadTablaRespuestas__fila">
        {headersOrdenados && (
          <th
            className="HeadTablaRespuestas__header--sin-padding"
            title="Notas"
          >
            <InlineIcon
              style={{ fontSize: '.75rem' }}
              icon="mdi:note-text-outline"
            />
          </th>
        )}
        {headersOrdenados.map(({ nombre, texto }, i) => (
          <th
            key={`header-${nombre}`}
            className={classNames({
              HeadTablaRespuestas__header: true,
              'HeadTablaRespuestas__header--activo':
                modalFiltroActivo && i === indiceColumnaFiltrada,
              'HeadTablaRespuestas__header--destacado': columnaDestacada === i,
            })}
            onClick={() => mostrarModalFiltros(i)}
            onMouseEnter={() => dispatch(destacaColumna(i))}
            onMouseLeave={() => dispatch(yaNoDestaquesColumna())}
            title={texto}
          >
            <span className="HeadTablaRespuestas__texto_header">
              <span>
                {parchar(texto)}
                <span className="HeadTablaRespuestas__icono_orden">
                  {ordenHeader === nombre && (
                    <InlineIcon
                      icon={orden === 'ASC' ? 'mdi:arrow-up' : 'mdi:arrow-down'}
                    />
                  )}
                </span>
              </span>
              <button className="HeaderTablaRespuestas__boton_filtros">
                <InlineIcon
                  icon="mdi:arrow-down-drop"
                  className="HeaderTablaRespuestas__icono_filtros"
                />
              </button>
            </span>
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
